import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import SocialNetwork from '../abis/SocialNetwork.json'

class Main extends Component {


  render() {
    document.title = "Social Media"
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.BlockChain.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            BlockChain
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth:'500px'}}>
              <div className="content mr-auto ml-auto">
              <p>&nbsp;</p>
              <form onSubmit={(event)=>{
                  event.preventDefault()
                  const content= this.postContent.value
                 
                  this.props.createPost(content)
              }}>
                  <div className="form-group mr-sm-2">
                      <input id="postcontent" type="text"
                      ref={(input)=>{this.postContent=input}}
                      className="form-control" placeholder="whats on your mind ?"
                      required/>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Share</button>
              </form>
              <p>&nbsp;</p>
               { this.props.posts.map((post, key)=>{
                return(
                  <div className="card mb-4" key={key}>
                  <div className="card-header">
                  <small className="text-muted">{post.author}</small>
                  </div>
                  <ul id="postlist" className="list-group list-group-flush">
                  <li className="list-group-item">
                    <p>{post.content}</p>
                  </li>
                  <li key={key} className="list-group-item py-2">
                   <small className="float-left mt-1 text-muted">
                     TIPS: {window.web3.utils.fromWei(post.tipAmount.toString(),'Ether')}ETH
                   </small>
                   <button className="btn btn-link btn-sm float-right pt-0"
                          name={post.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.1', 'Ether')
                            this.props.tipPost(event.target.name, tipAmount)
                          }}
                        >
                          TIP 0.1 ETH
                   </button>
                  </li>
                  </ul>
                  </div>
                )
               })}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
