pragma solidity ^0.5.0;
contract SocialNetwork {
    string public name;
    uint public postcount=0;
    mapping(uint => Post) public posts;

    struct Post {
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
      event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
    constructor() public{
        name="Pratik";
    }

    function createPost(string memory _content) public{

        require(bytes(_content).length > 0);
        postcount++;
        posts[postcount] = Post(postcount,_content,0, msg.sender);

        emit PostCreated(postcount, _content,0,msg.sender);
    } 
    function tipPost(uint _id) public payable{
        require(_id>0 && _id<=postcount);
        // Fetch the Post
        Post memory _post=posts[_id];
        // Fetch the Author
        address payable _author=_post.author; 
        // pay the author  by send ether
        address(_author).transfer(msg.value);
        // increment tip amount by
      _post.tipAmount=_post.tipAmount + msg.value;
        // update the post
        posts[_id] = _post;
                emit PostTipped(postcount, _post.content,_post.tipAmount,_author);

    }

}