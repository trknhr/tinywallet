package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/btcsuite/btcd/btcec/v2"
	"github.com/btcsuite/btcd/btcutil"
	"github.com/btcsuite/btcd/chaincfg"
	_ "github.com/btcsuite/btcwallet/walletdb/bdb"
)

type WalletInfo struct {
	Balance      float64           `json:"balance"`
	Transactions []TransactionInfo `json:"transactions"`
	Address      string            `json:"address"`
}

type TransactionInfo struct {
	Address       string  `json:"address"`
	Time          int64   `json:"time"`
	Amount        float64 `json:"amount"`
	Confirmations int64   `json:"confirmations"`
}

func main() {
	net := &chaincfg.TestNet3Params

	// Generate a new private key.
	privateKey, err := createPrivateKeyIfNoExistence("private_key.txt")
	if err != nil {
		fmt.Println("Failed to generate private key:", err)
		return
	}

	// Get the public key.
	publicKey := privateKey.PubKey()

	// Get the P2PKH address.
	pubKeyHash := btcutil.Hash160(publicKey.SerializeCompressed())
	address, err := btcutil.NewAddressPubKeyHash(pubKeyHash, net)
	if err != nil {
		log.Fatalf("Failed to create address: %v", err)
		return
	}

	// Fetch and print balance
	balance, err := fetchBalance(address.EncodeAddress())
	if err != nil {
		log.Fatalf("Failed to fetch balance: %v", err)
		return
	}

	// Fetch and print transactions
	transactions, err := fetchTransactions(address.EncodeAddress())
	if err != nil {
		log.Fatalf("Failed to fetch transactions: %v", err)
		return
	}

	walletInfo := WalletInfo{
		Balance:      float64(balance) / float64(btcutil.SatoshiPerBitcoin),
		Transactions: transactions,
		Address:      address.EncodeAddress(),
	}

	walletInfoJson, err := json.MarshalIndent(walletInfo, "", "  ")
	if err != nil {
		log.Fatalf("Failed to marshal wallet info: %v", err)
	}

	// output jsondata
	fmt.Println(string(walletInfoJson))
}

func createPrivateKeyIfNoExistence(privateKeyFileName string) (*btcec.PrivateKey, error) {
	// Set the private key file path.
	keyFile := privateKeyFileName

	// Check if the private key file exists.
	var privateKey *btcec.PrivateKey
	if _, err := os.Stat(keyFile); os.IsNotExist(err) {
		// Generate a new private key.
		privateKey, err = btcec.NewPrivateKey()
		if err != nil {
			fmt.Println("Failed to generate private key:", err)
			return nil, err
		}

		// Save the private key to a file.
		privateKeyBytes := privateKey.Serialize()
		if err := ioutil.WriteFile(keyFile, privateKeyBytes, 0600); err != nil {
			fmt.Println("Failed to save private key to file:", err)
			return nil, err
		}
		return privateKey, nil
	}
	// Load the private key from the file.
	privateKeyBytes, err := ioutil.ReadFile(keyFile)
	if err != nil {
		fmt.Println("Failed to read private key from file:", err)
		return nil, err
	}

	privateKey, _ = btcec.PrivKeyFromBytes(privateKeyBytes)

	return privateKey, nil
}

// BlockCypher API URL for Testnet
const blockCypherTestnetAPI = "https://api.blockcypher.com/v1/btc/test3"

type Txref struct {
	TxHash string `json:"tx_hash"`
}

func fetchTransactions(address string) ([]TransactionInfo, error) {
	resp, err := http.Get(fmt.Sprintf("%s/addrs/%s/full", blockCypherTestnetAPI, address))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var addrInfo AddressInfo
	if err := json.Unmarshal(body, &addrInfo); err != nil {
		return nil, err
	}

	transactions := make([]TransactionInfo, len(addrInfo.Txs))
	for i, tx := range addrInfo.Txs {
		transaction := TransactionInfo{
			Address:       address,
			Time:          tx.Confirmed.Unix(),
			Amount:        float64(tx.Total) / float64(btcutil.SatoshiPerBitcoin),
			Confirmations: tx.Confirmations,
		}
		transactions[i] = transaction
	}

	return transactions, nil
}

type AddressInfo struct {
	Balance int64   `json:"balance"`
	Txrefs  []Txref `json:"txrefs"`
	Txs     []Tx    `json:"txs"`
}

type Tx struct {
	Total         int64     `json:"total"`
	Confirmations int64     `json:"confirmations"`
	Confirmed     time.Time `json:"confirmed"`
}

func fetchBalance(address string) (int64, error) {
	resp, err := http.Get(fmt.Sprintf("%s/addrs/%s", blockCypherTestnetAPI, address))
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var addrInfo AddressInfo
	if err := json.Unmarshal(body, &addrInfo); err != nil {
		return 0, err
	}

	return addrInfo.Balance, nil
}
