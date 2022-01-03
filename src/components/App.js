import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json'
import Main from './Main.js';

class App extends Component {
async componentWillMount() {
  await this.loadWeb3();
  await this.loadBlockchainData()
}
async loadWeb3(){
  // if (typeof window.web3 !== 'undefined') {
  //   App.web3Provider = window.web3.currentProvider;
  //   window.web3 = new Web3(window.web3.currentProvider);
  // } else {
  //   // If no injected web3 instance is detected, fallback to Ganache.
  //   App.web3Provider = new window.web3.providers.HttpProvider('http://127.0.0.1:7545');
  //   window.web3 = new Web3(App.web3Provider);
  // }
  if(window.ethereum)
  {
    window.web3=new Web3(window.ethereum)
    // await window.ethereum.enable()
  }
  // else if(window.web3)
  // {
  //   window.web3 =new Web3(window.web3.currentProvider)
  // }
  else
  {
    window.alert("Non-Ethereum Browser Detected try metamask")
  }
}
async loadBlockchainData() {
  const web3= window.web3
  //load account 


  const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
  this.setState({ account: accounts[0] })
  // Network Id
  const networkId = await web3.eth.net.getId()
  console.log(networkId)
  const networkdata=SocialNetwork.networks[networkId]
  if(networkdata)
  {
    const socialNetwork=web3.eth.Contract(SocialNetwork.abi, networkdata.address)
    this.setState({ socialNetwork})
    const postCount=await socialNetwork.methods.postcount().call()
    this.setState({ postCount })
    console.log(postCount)
    // Load posts
    for (var i=1;i<=postCount;i++)
    {
      const post= await socialNetwork.methods.posts(i).call()
      this.setState({ posts:[...this.state.posts, post] })
    }
    console.log({ posts:this.state.posts })
   
    this.setState({loading:false})
  } else
  {
    window.alert('Social Network not deployed')
  }
  
}
createPost(content) {
  this.setState({loading:true})
  console.log(this.state.account)
  this.state.socialNetwork.methods.createPost(content).send({ from: this.state.account })
  .once('receipt',(receipt)=>{
    this.setState({ loading:false}).exit()
  })
  
}
tipPost(id, tipAmount) {
  this.setState({ loading: true })
  //web3.eth.sendTransaction({from: this.state.account, to: _authorPay, value: tipAmount})
  this.state.socialNetwork.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
  .once('receipt', (receipt) => {
    this.setState({ loading: false })
  })
  .on('confirmation', function(confirmationNumber, receipt){
    window.location.reload();
  })
}
constructor(props)
{
  
  super(props)
  
  this.state = {
    account: '' ,
    socialNetwork:null,
    postCount:0,
    posts:[],
    loading:true
  }
  this.createPost=this.createPost.bind(this) 
  this.tipPost = this.tipPost.bind(this) 
}


  render() {
    return (
      <div>
      {
        this.state.loading 
        ?<div id="loader" className="text-center mt-5"><p>Loading...</p></div>
        :<Main 
        posts={this.state.posts}
        createPost={this.createPost}
        tipPost={this.tipPost}
        />
      }
       
      </div>
    );
  }
}

export default App;
