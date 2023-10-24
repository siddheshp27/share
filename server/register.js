const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function registerUser(data) {
  try {
    // load the network configuration
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

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(data.orgId);
    if (userIdentity) {
      console.log(`An identity for the user ${data.orgId} already exists in the wallet`);
      return `An identity for the user ${data.orgId} already exists in the wallet`;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    // build a user dataect for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user, enroll the user, and import the new identity into the wallet.
    let attrs = [
      {
        name: 'name',
        value: data.name,
        ecert: true
      },
      {
        name: 'email',
        value: data.email,
        ecert: true
      },

      {
        name: 'hashedPassword',
        value: data.hashedPassword,
        ecert: true
      }
    ];

    const secret = await ca.register(
      {
        affiliation: 'org1.department1',
        enrollmentID: data.userName,
        role: 'client',
        attrs: attrs
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: data.userName,
      enrollmentSecret: secret
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type: 'X.509'
    };
    await wallet.put(data.userName, x509Identity);
    console.log(`Successfully registered and enrolled user ${data.userName} and imported it into the wallet`);
    return 'success';
  } catch (error) {
    console.error(`Failed to register user : ${error}`);
    process.exit(1);
  }
}

module.exports = registerUser;
