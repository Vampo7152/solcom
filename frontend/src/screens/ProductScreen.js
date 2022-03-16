import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate

		//Solana Wallet 
    const [walletAddress, setWalletAddress] = useState(null);
		// Set our network.
	const network = clusterApiUrl('devnet');
	const [validNFT, setValidNFT] = useState(false);
	const [buttonStatus,setButtonStatus] = useState(false)
	const [size, setSize] = useState(null);
	const [sizeno, setSizeno] = useState(null);

//wallet functions 

const checkIfWalletIsConnected = async () => {
  try {
    const { solana } = window;

    if (solana) {
    if (solana.isPhantom) {
      console.log('Phantom wallet found!');

       const response = await solana.connect({ onlyIfTrusted: true });
    console.log(
      'Connected with Public Key:',
      response.publicKey.toString()
    );
    setWalletAddress(response.publicKey.toString());

    }
    } else {
    alert('Solana object not found! Get a Phantom Wallet 👻');
    }
  } catch (error) {
    console.error(error);
  }
  };

  const getAllNFTs = async (tempAddress) =>{
    checkIfWalletIsConnected();
    console.log(tempAddress);
    const connection = new Connection(network);
    const ownerPublickey = new PublicKey(tempAddress);
    const nftsmetadata = await Metadata.findDataByOwner(connection, ownerPublickey);
    verifyNFT(nftsmetadata)
  }


const connectWallet = async () =>{
  const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
    getAllNFTs(response.publicKey.toString());
  }
}

//verify NFT from wallet

const symbols = ["0xD"]
const nftProjectCreators = ["HMNWAwcDrU3dVNQxgxLc3bLYuJtBnXj2pE2FAGhzctK4"]

const symbolCheck = (symbol) =>{
  for(var count=0 ; symbols>=count;count++){
    if(symbols[count]=== symbol){
      return true;
    }
    else{
      return false;
    }
  }
}

const creatorCheck = (creator) =>{
  
for(var countofCreator = 0; creator.length>=countofCreator;countofCreator++){
  console.log(creator[countofCreator].address);
  for(var creatorCount = 0; nftProjectCreators.length>=creatorCount;creatorCount++){
    if(nftProjectCreators[creatorCount] === creator[countofCreator].address){
      return true;
    }else{
      continue;
    }
  }
}
}


const verifyNFT = async (nftMetaData) =>{

  for(var i=0; nftMetaData.length > i; i++ ){

    const symbolValid =  symbolCheck(nftMetaData[i].data.symbol)
    const creatorValid =  creatorCheck(nftMetaData[i].data.creators)

    if(symbolValid === true && creatorValid ===true){
      setValidNFT(true)
      break;
    }
  }
  //console.log(nftMetaData[0].data.symbol)
  //console.log(nftMetaData[0].data.creators)
}

  useEffect(() => {
    if (successProductReview) {
      setRating(0)
      setComment('')
    }
    if (!product._id || product._id !== match.params.id) {
      dispatch(listProductDetails(match.params.id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, match, successProductReview])

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview(match.params.id, {
        rating,
        comment,
      })
    )
  }

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>
                <strong>Description:</strong>{' '}
									{product.description}
                </ListGroup.Item>
                <ListGroup.Item>
									<strong>Category: </strong>{' '}
									{product.category}
								</ListGroup.Item>
								<ListGroup.Item>
									<strong>Brand: </strong>{' '}
									{product.brand}
								</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
{/* IF/Else statement for kind of product here, so get the size chart based on it */}
<ListGroup.Item>
											<Row>
												<Col>
													<strong>Size</strong>
												</Col>
												<Col>
													<Form.Control
														as='select'
														value={qty}
														onChange={(e) =>
															setSize(
																e.target.value
															)
														}>
														{/* create as many options as the countInStock */}
														{[
															...Array(
																product.countInStock
															).keys(),
														].map((ele) => (
															<option
																key={ele + 1}
																value={ele + 1}>
																{ele + 1}
															</option>
														))}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
                  <ListGroup.Item>
                  <Row>
											
                      {walletAddress===null && product.isMembersOnly === true && (
                              <Button
                              onClick={connectWallet}
                              type='button'
                              className='btn-block btn-lg main-button'
                              disabled={
                                !buttonStatus
                              }>
                              Connect Wallet
                            </Button>
                        )}
  
  
                        {product.isMembersOnly === false && (
                            <Button
                            onClick={addToCartHandler}
                            type='button'
                            className='btn-block btn-lg main-button'
                            disabled={
                              !buttonStatus
                            }>
                            Add To Cart
                          </Button>
                        )}
  
                        {walletAddress!==null && product.isMembersOnly === true && validNFT === true && (
                          <div>
                          <p>Congratulations, you have a valid NFT to buy this product !!</p>
                          
                          <Button
                          onClick={addToCartHandler}
                          type='button'
                          className='btn-block btn-lg main-button'
                          disabled={
                            !buttonStatus
                        }>
                          Add To Cart
                          </Button>
                          </div>
                        )}
  
                        {walletAddress!==null && product.isMembersOnly === true && validNFT === false && (
                          <div>
                          <p>Sorry :/ , you do not have a valid NFT to buy this product</p>
                          
                      
                          </div>
                        )}
                      </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {successProductReview && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/login'>sign in</Link> to write a review{' '}
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
