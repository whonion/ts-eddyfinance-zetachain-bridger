import { ethers } from 'ethers';
import * as fs from 'fs';

//Bridge InputData
const inputData = '0xd91b507f2a3e2d4a32d0c86ac19fead2d461008d2097118a42ba86fbdd15eaf0f546845258d03aae5f0b1a82749cb4e2278ec87f8bf6b618dc71a8bf'

//const inputData2 = '0xd91b507f2a3e2d4a32d0c86ac19fead2d461008d95f159fcad1e5b6caaba24b468c46736479c812948f80608b672dc30dc7e3dbbd0343c5f02c738eb'
//Contract execution Zetachain
//https://bscscan.com/address/0x70e967acfcc17c3941e87562161406d41676fd83
//1. onReceive (0x29dd214d)

// Define the range for the random amount
const minAmount = 0.00042069; // Minimum amount in native coin
const maxAmount = 0.00069420; // Maximum amount in native coin
const randomAmount = minAmount + Math.random() * (maxAmount - minAmount);

// Define the recipient address
const recipientAddress = '0x70e967acFcC17c3941E87562161406d41676FD83'; // Replace with the actual recipient address

// Connect to an Ethereum node (you can replace 'mainnet' with 'ropsten' or other networks that can be used for bridge)
const provider =  new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc');

async function sendEther() {
  // Read private keys from 'private_keys.txt'
  const privateKeys = fs.readFileSync('data/private_keys.txt', 'utf-8').split('\n');

// Check if private keys are empty
  if (privateKeys.length === 0 || (privateKeys.length === 1 && privateKeys[0].trim() === '')) {
    console.error('No private keys found in the file.');
    return;
  }
  
  // Iterate through each private key and send Ether to the recipient
  for (const privateKey of privateKeys) {
    const wallet = new ethers.Wallet(privateKey.trim(), provider);
    try {

      // Define the amount of Ether to send (in wei)
      const amountToSend = ethers.utils.parseEther(randomAmount.toFixed(18));

      // Create a transaction
      const transaction = {
        to: recipientAddress,
        value: amountToSend,
        data: inputData,
      };

      // Sign and send the transaction
      const tx = await wallet.sendTransaction(transaction);
      await tx.wait();

      console.log(`Transaction sent from ${wallet.address}(BNBChain) to ${recipientAddress}(ZetaChain)\n TxHash: https://bscscan.com/tx/${tx.hash}`);
    } catch (error:any) {
      //catch 'INSUFFICIENT_FUNDS'
      if (error.code === 'INSUFFICIENT_FUNDS') {
        console.error(`Error: Insufficient funds for transfer from ${wallet.address} | You small than ${randomAmount} +txn cost BNB on balance`);
      } else {
        console.error(`Error sending BNB from ${wallet.address}: ${error.message}`);
      }
  }
}
}
// Call the function to send Ether
sendEther();
