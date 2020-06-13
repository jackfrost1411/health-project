from block import Block
#from blockchain import Blockchain
from flask import Flask, request, render_template
import requests
import json
import datetime
from hashlib import sha256
from flask_cors import CORS
try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO
import base64
from matplotlib import pyplot as plt
"""
*****************************BLOCKCHAIN CLASS********************************************************************************
"""
class Blockchain:
    difficulty=2
    def __init__(self):
        self.chain = []
        self.unconfirmed_transactions = []
        self.genesis_block()

    def genesis_block(self):
        transactions = []
        genesis_block = Block(transactions, "0", str(datetime.datetime.now()))
        #genesis_block.generate_hash()
        self.chain.append(genesis_block)

    def add_block(self, transactions):
        previous_hash = (self.chain[len(self.chain)-1]).hash
        new_block = Block(transactions, previous_hash, str(datetime.datetime.now()))
        #calculate nonce 
        proof = self.proof_of_work(new_block)
        #new_block.hash = proof
        self.chain.append(new_block)
        return proof, new_block
    
    #when other node has already calculated nonce faster than other than no need for others to calculate proof
    def add_block2(self, transactions, proof):
        previous_hash = (self.chain[len(self.chain)-1]).hash
        new_block = Block(transactions, previous_hash, str(datetime.datetime.now()))
        #calculate nonce 
        #proof = self.proof_of_work(new_block)
        new_block.hash = proof
        self.chain.append(new_block)
        return proof, new_block
    
    def add_block3(self, block, proof):
        """
        A function that adds the block to the chain after verification.
        Verification includes:
        * Checking if the proof is valid.
        * The previous_hash referred in the block and the hash of a latest block
          in the chain match.
        """
        self.chain.append(block)
        
        return self.validate_chain()

    #to see whether the chain is broken or tampered with or not
    def validate_chain(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if(current.hash != current.generate_hash()):
                print(current.hash)
                print(current.generate_hash())
                print("Current hash does not equal generated hash")
                return False
            if(current.previous_hash != previous.generate_hash()):
                print("Previous block's hash got changed")
                return False
        return True
    
    #To calculate proof of work for a block
    def proof_of_work(self, block, difficulty=2):
        proof = block.generate_hash()
        while proof[:2] != "0"*difficulty:
            block.nonce += 1
            proof = block.generate_hash()
        block.nonce = 0
        #print(proof)
        return proof
    
    #for storing unconfirmed transactions
    def add_new_transaction(self, transaction):
        self.unconfirmed_transactions.append(transaction)
        print(self.mine())
    
    
    """
        This function serves as an interface to add the pending
        transactions to the blockchain by adding them to the block
        and figuring out proof of work.
    """
    def last_block(self):
        """
        A quick pythonic way to retrieve the most recent block in the chain. Note that
        the chain will always consist of at least one block (i.e., genesis block)
        """
        return self.chain[-1]
    
    def mine(self):
        
        if not self.unconfirmed_transactions:
            return "No transactions to mine"
        else:
            self.add_block(self.unconfirmed_transactions[0])
            # Making sure we have the longest chain before announcing to the network
            chain_length = len(self.chain)
            print(consensus())
            if chain_length == len(blockchain.chain):
                # announce the recently mined block to the network
                announce_new_block(blockchain.last_block())
                self.unconfirmed_transactions.pop(0)
            return "Block #{} is mined.".format(len(blockchain.chain)-1)
    """    
    def mine(self):
        if not self.unconfirmed_transactions:
            return "No transactions to mine"
        else:
            self.add_block(self.unconfirmed_transactions[0])
            self.unconfirmed_transactions.pop(0)
            return "Block #{} is mined.".format(len(self.chain))
    """
    
    
    
    # (only for consensus() function) A helper method to check if the "given" blockchain is valid.
    def check_chain_validity(self, chain):
        for i in range(1, len(chain)):
            current = Block(chain[i]['transactions'], chain[i]['previous_hash'], chain[i]['time_stamp'])
            previous = Block(chain[i-1]['transactions'], chain[i-1]['previous_hash'], chain[i-1]['time_stamp'])
            #print("current block in chech chain validity")
            
            if(current.hash != current.generate_hash()):
                
                print("Current hash does not equal generated hash")
                return False
            if(current.previous_hash != previous.generate_hash()):
                print("Previous block's hash got changed")
                return False
        return True
    
            
    def print_blocks(self):
        for i in range(len(self.chain)):
            current_block = self.chain[i]
            print("Block {} {}".format(i, current_block))
            current_block.print_contents()
"""
**************************BLOCK CLASS***************************************************************************************************
"""
class Block:
    def __init__(self, transactions, previous_hash, timestamp):
        self.time_stamp = timestamp
        self.transactions = transactions
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.generate_hash()
    
    def generate_hash(self):
        block_header = str(self.time_stamp) + str(self.transactions) +str(self.previous_hash) + str(self.nonce)
        block_hash = sha256(block_header.encode())
        return block_hash.hexdigest()

    def print_contents(self):
        print("timestamp:", self.time_stamp)
        print("transactions:", self.transactions)
        print("current hash:", self.generate_hash())
        print("previous hash:", self.previous_hash) 
        
"""
*******************************************************************************************************************************
"""




block_one_transactions = {"patient_id": "5e46af007f6d761f185ce", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"1","disease":"fever","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
block_two_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"20","weight":"50","height":"14","disease":"fever","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_three_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"16","weight":"50","height":"146","disease":"fever","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
block_four_transactions = {"patient_id": "5e46af007f6d761f185ce", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"1","disease":"cold","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_five_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"14","disease":"cold","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
block_six_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"146","disease":"cold","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
block_seven_transactions = {"patient_id": "5e46af007f6d761f185ce", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"1","disease":"jaundice","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_eight_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"14","disease":"pneumonia","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_nine_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"146","disease":"fever","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
block_ten_transactions = {"patient_id": "5e46af007f6d761f185ce", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"1","disease":"jaundice","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_eleven_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"14","disease":"cold","severity": "high","location":"Gandhinagar","medicine": "aspirin, racetamol, combiflam"}
block_twelve_transactions = {"patient_id": "5e46af007f6d761f185cebd8", "doctor_id":"5e46a8eebe3f72158cf69524", "doctor_name": "Foram","age":"19","weight":"50","height":"146","disease":"fever","severity": "high","location":"Ahmedabad","medicine": "aspirin, racetamol, combiflam"}
#fake_transactions = {"sender": "Bob", "receiver":"Cole, Alice", "amount":"25"}

app = Flask(__name__, template_folder='template')
CORS(app)
blockchain = Blockchain()
#local_blockchain.print_blocks()
# Contains the host addresses of other participating members of the network
peers = []

#to add new transaction to the chain and then for mining 
@app.route('/new_transaction', methods=['POST'])
def new_transaction():
    #required contents of the block
    patient_id = request.get_json()['patient_id']
    doctor_id = request.get_json()['doctor_id']
    doctor_name = request.get_json()['doctor_name']
    age = request.get_json()['age']
    weight = request.get_json()['weight']
    height = request.get_json()['height']
    disease = request.get_json()['disease']
    severity = request.get_json()['severity']
    location = request.get_json()['location']
    medicine = request.get_json()['medicine']
    print("called")
    
    #block_data = request.get_json()
    
    #required_fields = ["author", "content"]
    
    if not (patient_id and doctor_id):
        return "Invalid transaction data", 404
    
    blockchain.add_new_transaction({"patient_id":patient_id, "doctor_id":doctor_id, "doctor_name":doctor_name, "age":age,
                                   "weight":weight, "height":height, "disease":disease, "severity":severity, "location":location,
                                   "medicine":medicine})
    
    return "Success", 201
        

@app.route('/chain', methods=['GET'])
def get_chain():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),
                       "chain": chain_data})

@app.route('/get_patient_data', methods=['POST'])
def get_patient_data():
    patient_id = request.get_json()['patient_id']
    chain_data = []
    n=0
    for block in blockchain.chain:
        if n>0:
            block_data = block.__dict__['transactions']
            print(block_data)
            p_id = block_data['patient_id']
            print(p_id)
            if(patient_id == p_id):
                chain_data.append(block.__dict__)
        n+=1
    return json.dumps({"chain": chain_data})

@app.route('/diseasewise', methods=['POST'])
def diseasewise():
    disease0 = request.get_json()['disease']
    chain_data = []
    n=0
    for block in blockchain.chain:
        if n>0:
            block_data = block.__dict__['transactions']
            print(block_data)
            disease1 = block_data['disease']
            print(disease1)
            if(disease0.lower() == disease1.lower()):
                chain_data.append(block_data['location'].capitalize())
        n+=1
    return json.dumps({"chain": chain_data})

@app.route('/diseasewiseage', methods=['POST'])
def diseasewiseage():
    disease0 = request.get_json()['disease']
    chain_data = []
    n=0
    for block in blockchain.chain:
        if n>0:
            block_data = block.__dict__['transactions']
            print(block_data)
            disease1 = block_data['disease']
            print(disease1)
            if(disease0.lower() == disease1.lower()):
                chain_data.append(block_data['age'].capitalize())
        n+=1
    return json.dumps({"chain": chain_data})

@app.route('/locationwise', methods=['POST'])
def locationwise():
    location0 = request.get_json()['location']
    chain_data = []
    output={}
    n=0
    for block in blockchain.chain:
        if n>0:
            block_data = block.__dict__['transactions']
            print(block_data)
            location1 = block_data['location']
            print(location1)
            if(location0.lower() == location1.lower()):
                chain_data.append(block_data['disease'].capitalize())
        n+=1
    return json.dumps({"chain": chain_data})
    
    
# Endpoint to add new peers to the network
@app.route('/register_node', methods=['POST'])
def register_new_peers():
    # The host address to the peer node 
    node_address = request.get_json()["node_address"]
    if not node_address:
        return "Invalid data", 400

    # Add the node to the peer list
    peers.append(node_address)
    print(peers)
    
    if len(peers)>1:
        for i in range(len(peers)-1):
            requests.post(peers[i]+"append_explicitly", data=json.dumps({"newP" : peers[len(peers)-1]}), headers = {'Content-Type': "application/json"})
    #print("host:" + request.host)
    # Return the blockchain to the newly registered node so that it can sync
    return get_chain()

@app.route('/peers_list', methods=['GET'])
def peers_list():
    return json.dumps({"peers": peers})

@app.route('/register_with', methods=['POST'])
def register_with():
    node_address = request.get_json()["node_address"]
    if not node_address:
        return "Invalid data", 400

    data = {"node_address": request.host_url}
    headers = {'Content-Type': "application/json"}
    url = node_address + "/register_node"
    # Make a request to register with remote node and obtain information
    
    response = requests.post(url, data=json.dumps(data), headers=headers)
    host_peers = requests.get(node_address + "/peers_list")
    print(host_peers.json())
    host_peers = host_peers.json()["peers"]
    for i in range(len(host_peers)):
        print(host_peers[i])
    #return response.json()
    resp = response.json()
    print(resp)
    if resp:
        global blockchain
        global peers
        # update chain and the peers
        chain_dump = resp['chain']
        blockchain = create_chain_from_dump(chain_dump)
        #print(blockchain)
        #print(resp)
        peers.append(str(node_address).replace("127.0.0.1","localhost")+"/")
        print("8001 peers")
        print(peers)
        print("extra peers")
        for i in range(len(host_peers)):
            peers.append(str(host_peers[i]))
        print(peers)
        #print(str("http://"+str(request.host)))
        peers.remove("http://"+str(request.host)+"/")
        
        print(peers)
        #print(blockchain.chain)
        return "Registration successful", 200
    else:
        # if something goes wrong, pass it on to the API response
        return response.content, response.status_code
    
@app.route('/append_explicitly', methods=["POST"])
def append_explicitly():
    res = request.get_json()["newP"]
    print(res)
    peers.append(res)
    print(peers)
    return "Done", 200
    
def create_chain_from_dump(chain_dump):
    blockchain = Blockchain()
    blockchain.chain.pop()
    for idx, block_data in enumerate(chain_dump):
        print("idx"+str(idx)+"block_data"+str(block_data))
        block = Block(block_data["transactions"],
                      block_data["previous_hash"],
                      block_data["time_stamp"])
        block.hash = block_data["hash"]
        if idx > 0:
            if not blockchain.add_block3(block, block_data["hash"]):
                raise Exception("The chain dump is tampered!!")
        else:
            # the block is a genesis block, no verification needed
            print("genesis block adding")
            blockchain.chain.append(block)
            print(block)
    return blockchain

# endpoint to add a block mined by someone else to
# the node's chain. The node first verifies the block
# and then adds it to the chain.
@app.route('/add_block', methods=['POST'])
def verify_and_add_block():
    block_data = request.get_json()
    print("block_data")
    print(block_data)
    block = Block(block_data["transactions"],block_data["previous_hash"],block_data["time_stamp"])
    proof = block_data['hash']
    added = blockchain.add_block3(block, proof)

    if not added:
        return "The block was discarded by the node", 400

    return "Block added to the chain", 201


def announce_new_block(block):
    #block = Block(block['transactions'], block['previous_hash'], block['time_stamp'])
    for peer in peers:
        url = "{}add_block".format(peer)
        headers = {'Content-Type': "application/json"}
        print("block_data1")
        print(block.__dict__)
        requests.post(url, data=json.dumps(block.__dict__), headers=headers)
        
#simple consensus algorithm. If a longer valid chain is found, our chain is replaced with it.
def consensus():
        
        global blockchain

        longest_chain = None
        current_len = len(blockchain.chain)
        print("peers")
        print(peers)
        for node in peers:
            response = requests.get('{}/chain'.format(node))
            print(response.json())
            length = response.json()['length']
            chain = response.json()['chain']
            if length > current_len and blockchain.check_chain_validity(chain):
                # Longer valid chain found!
                current_len = length
                longest_chain = chain

        if longest_chain:
            blockchain = longest_chain
            return True

        return False              
        
        
@app.route('/pending_tx')
def get_pending_tx():
    return json.dumps(blockchain.unconfirmed_transactions)

@app.route('/graph/', methods=['POST'])
def graph():

    img = StringIO()
    y = [1,2,3,4,5]
    x = [0,2,1,3,4]
    plt.xlabel('x-values')
    plt.ylabel('y-values')
    plt.plot(x,y)
    plt.savefig('img.png')
    
    img.seek(0)
    with open("img.png", "rb") as img_file:
        my_string = base64.b64encode(img_file.read())
    #plot_url = base64.b64encode(img.getvalue())
    #print(my_string)
    return my_string
    




blockchain.add_block(block_one_transactions)
blockchain.add_block(block_two_transactions)
blockchain.add_block(block_three_transactions)
blockchain.add_block(block_four_transactions)
blockchain.add_block(block_five_transactions)
blockchain.add_block(block_six_transactions)
blockchain.add_block(block_seven_transactions)
blockchain.add_block(block_eight_transactions)
blockchain.add_block(block_nine_transactions)
blockchain.add_block(block_ten_transactions)
blockchain.add_block(block_eleven_transactions)
blockchain.add_block(block_twelve_transactions)
#local_blockchain.print_blocks()

#blockchain.chain[2].transactions = fake_transactions
#blockchain.validate_chain()

@app.route('/get_data', methods=['POST'])
def retrieve():
    chain_data = []
    for block in blockchain.chain:
        chain_data.append(block.__dict__)
    return json.dumps({"length": len(chain_data),
                       "chain": chain_data})
    
    
    

if __name__ == "__main__":
    app.run(debug=True)
