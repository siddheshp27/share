const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
var eccrypto = require('eccrypto');
const { response } = require('express');
var privateKeyB = eccrypto.generatePrivate();
var publicKeyB = eccrypto.getPublic(privateKeyB);
exports.getCids = async (userName) => {
  try {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'fabric-samples',
      'test-network',
      'organizations',
      'peerOrganizations',
      'org1.example.com',
      'connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userNameentity = await wallet.get(userName);
    if (!userNameentity) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);

      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userName,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('certificateContract');
    let result = await contract.evaluateTransaction('getCid', userName);

    // const buffer = Buffer.from(readPatientHistoryDataArray);

    // const strData = buffer.toString();
    // if (!strData) {
    //   return;
    // }
    // let readPatientHistoryDataJson = JSON.parse(strData);

    // let encryptedHistoryArray = [];
    // readPatientHistoryDataJson.forEach((patientData) => {
    //   let encryptedData = patientData.encryptedData;
    //   let iv = patientData.iv;
    //   let decryptedData = decryptData(encryptedData, iv);
    //   encryptedHistoryArray.push(JSON.parse(decryptedData));
    // });

    await gateway.disconnect();

    const response = JSON.parse(result.toString());
    // const cids = response.cids;

    // Now you can process the 'cids' array
    // for (const cid of cids) {
    //   console.log('CID');
    //   for (const property in cid) {
    //     console.log(`${property}: ${cid[property]}`);
    //   }
    // Process or display the CID as needed
    return response;

    // return readPatientHistoryDataJson;
    // const temp = JSON.parse(readUserCids.toString()).cids;
    // console.log(temp);
    // return JSON.parse(readUserCids.toString());
  } catch (error) {
    console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
    // process.exit(1);
  }
};
exports.getCid = async (userName) => {
  try {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'fabric-samples',
      'test-network',
      'organizations',
      'peerOrganizations',
      'org1.example.com',
      'connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userNameentity = await wallet.get(userName);
    if (!userNameentity) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);

      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userName,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');

    const contract = network.getContract('certificateContract');
    let result = await contract.evaluateTransaction('getSingleCid', userName);

    // const buffer = Buffer.from(readPatientHistoryDataArray);

    // const strData = buffer.toString();
    // if (!strData) {
    //   return;
    // }
    // let readPatientHistoryDataJson = JSON.parse(strData);

    // let encryptedHistoryArray = [];
    // readPatientHistoryDataJson.forEach((patientData) => {
    //   let encryptedData = patientData.encryptedData;
    //   let iv = patientData.iv;
    //   let decryptedData = decryptData(encryptedData, iv);
    //   encryptedHistoryArray.push(JSON.parse(decryptedData));
    // });

    await gateway.disconnect();

    const response = JSON.parse(result);
    // const cids = response.cid;

    // Now you can process the 'cids' array
    // for (const cid of cids) {
    // console.log('CID', response);
    // console.log(data);
    // const dataEncrypted = {
    //   iv: Buffer.from(data.iv),
    //   ephemPublicKey: Buffer.from(data.ephemPublicKey),
    //   ciphertext: Buffer.from(data.ciphertext),
    //   mac: Buffer.from(data.mac)
    // };
    // console.log(dataEncrypted);

    // eccrypto
    //   .decrypt(privateKeyB, dataEncrypted)
    //   .then((plaintext) => {
    //     console.log('Decrypted image:', plaintext.toString());
    //     // res.status(200).json({ data: plaintext.toString() });
    //   })
    //   .catch((error) => {
    //     console.error('Decryption failed:', error);
    //     // res.status(500).send('Decryption failed');
    //   });

    // for (const property in cid) {
    //   console.log(`${property}: ${cid[property]}`);
    // }
    // Process or display the CID as needed
    // }
    return response;

    // return readPatientHistoryDataJson;
    // const temp = JSON.parse(readUserCids.toString()).cids;
    // console.log(temp);
    // return JSON.parse(readUserCids.toString());
  } catch (error) {
    console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
    // process.exit(1);
  }
};
exports.putCid = async (userName, data) => {
  try {
    const ccpPath = path.resolve(
      __dirname,
      '..',
      'fabric-samples',
      'test-network',
      'organizations',
      'peerOrganizations',
      'org1.example.com',
      'connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userNameentity = await wallet.get(userName);
    if (!userNameentity) {
      console.log(`An identity for the user ${userName} does not exist in the wallet`);

      return;
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userName,
      discovery: { enabled: true, asLocalhost: true }
    });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('certificateContract');
    let responsePutCid = await contract.submitTransaction('addCid', userName, JSON.stringify(data));
    await gateway.disconnect();
    return responsePutCid;
  } catch (error) {
    console.error(`Failed to evaluate transaction in readPatientHistoryData: ${error}`);
  }
};
