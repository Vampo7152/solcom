import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button  } from 'react-bootstrap'
import FloatingLabel from "react-bootstrap-floating-label";
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [images, setImages] = useState('')
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isMembersOnly, setMembersOnlyStatus] = useState(false);
  const [sizeStockCount, setSizeStockCount] = useState([
	{size:"S", quantity:0},
	{size:"M", quantity:0},
	{size:"L", quantity:0},
	{size:"XL", quantity:0},
	{size:"XXL", quantity:0},
	{size:"3XL", quantity:0},
])



const [ShoesizeStockCount, setShoesizeStockCountSizeStockCount] = useState([
	{size:2, quantity:0},
	{size:3, quantity:0},
	{size:4, quantity:0},
	{size:5, quantity:0},
	{size:6, quantity:0},
	{size:7, quantity:0},
	{size:8, quantity:0},
	{size:9, quantity:0},
	{size:10, quantity:0},
	{size:11, quantity:0},
])


  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }
  const membersOnlyHandler = (event) =>{

	const tempMemberStatus = event.target.value
	
	setMembersOnlyStatus(tempMemberStatus)

}

	// update the product details in state
	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			history.push('/admin/productlist');
		} else {
			if (!product || product._id !== productId) {
				dispatch(listProductDetails(productId));
			} else {
				if(product.category === "Caps"){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setCountInStock(product.countInStock);
					setMembersOnlyStatus(product.isMembersOnly);
				}
				else if(product.category==="Shoes"){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setShoesizeStockCountSizeStockCount(product.ShoesizeStockCount)
					setMembersOnlyStatus(product.isMembersOnly);
				}
				else if(product.category === "T-Shirts" ||product.category === "Hoodies" ){
					setName(product.name);
					setPrice(product.price);
					setImages(product.image);
					setBrand(product.brand);
					setCategory(product.category);
					setDescription(product.description);
					setSizeStockCount(product.sizeStockCount);
					setMembersOnlyStatus(product.isMembersOnly);
				}

				
			}
		}
	}, [product, dispatch, productId, history, successUpdate]);

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image url'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId='category'>
									<FloatingLabel
										controlId='categoryinput'
										label='Category'
										className='mb-3'>
										<Form.Select
											size='lg'
											placeholder='Select category'
											type='text'
											value={category}
											onChange={(e) =>
												setCategory(e.target.value)
											}
										>
											<option value="null">Select a category</option>
											<option value="T-Shirts">T-Shirts</option>
											<option value="Hoodies">Hoodies</option>
											<option value="Caps">Caps</option>
											<option value="Shoes">Shoes</option>

										</Form.Select>
									</FloatingLabel>
								</Form.Group>
                {
									category === "T-Shirts" && (
										
								<Form.Group controlId='T-Shirt Sizes'>
								<FloatingLabel
									controlId='tshirtInput'
									label='Enter Quantity For Tshirt Sizes'
									className='mb-3'>
									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[0].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[0].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[0]}
											tempItem.quantity = e.target.value
											temp[0] = tempItem
											setSizeStockCount(temp)
							
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[1].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[1].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[1]}
											tempItem.quantity = e.target.value
											temp[1] = tempItem
											setSizeStockCount(temp)
								
											
										}}	
									
									/>




										<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[2].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[2].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[2]}
											tempItem.quantity = e.target.value
											temp[2] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[3].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[3].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[3]}
											tempItem.quantity = e.target.value
											temp[3] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>



<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[4].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[4].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[4]}
											tempItem.quantity = e.target.value
											temp[4] = tempItem
											setSizeStockCount(temp)
					
											
										}}	
									
									/>


<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[5].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[5].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[5]}
											tempItem.quantity = e.target.value
											temp[5] = tempItem
											setSizeStockCount(temp)
							
											
										}}	
									
									/>
										

								</FloatingLabel>
							</Form.Group>
									)
								}



								{ category === "Hoodies" && (
										
								<Form.Group controlId='hoodie'>
								<FloatingLabel
									controlId='hoodieInput'
									label='Enter Quantity For Hoodie Sizes'
									className='mb-3'>
									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[0].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[0].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[0]}
											tempItem.quantity = e.target.value
											temp[0] = tempItem
											setSizeStockCount(temp)
			
										}}		
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[1].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[1].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[1]}
											tempItem.quantity = e.target.value
											temp[1] = tempItem
											setSizeStockCount(temp)
						
											
										}}	
									
									/>




										<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[2].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[2].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[2]}
											tempItem.quantity = e.target.value
											temp[2] = tempItem
											setSizeStockCount(temp)
						
											
										}}	
									
									/>


									<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[3].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[3].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[3]}
											tempItem.quantity = e.target.value
											temp[3] = tempItem
											setSizeStockCount(temp)
										
										}}	
									
									/>



<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[4].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[4].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[4]}
											tempItem.quantity = e.target.value
											temp[4] = tempItem
											setSizeStockCount(temp)
									
											
										}}	
									
									/>


<Form.Control
										size='lg'
										
										type='text'
										value={sizeStockCount[5].size}
									/>

									<Form.Control
										size='lg'
										placeholder='Enter Quantity'
										type='text'
										value={sizeStockCount[5].quantity}
										onChange={(e)=>{
											let temp = [...sizeStockCount]
											let tempItem = {...temp[5]}
											tempItem.quantity = e.target.value
											temp[5] = tempItem
											setSizeStockCount(temp)
								
											
										}}	
									
									/>
										

								</FloatingLabel>
								</Form.Group>
								)}



								{ category === "Shoes" && (
										
										<Form.Group controlId='Shoes'>
										<FloatingLabel
											controlId='shoeInput'
											label='Enter Quantity For Shoe Sizes'
											className='mb-3'>
											
						
											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[0].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[0].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[0]}
													tempItem.quantity = e.target.value
													temp[0] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>




											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[1].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[1].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[1]}
													tempItem.quantity = e.target.value
													temp[1] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
									
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[2].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[2].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[2]}
													tempItem.quantity = e.target.value
													temp[2] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[3].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[3].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[3]}
													tempItem.quantity = e.target.value
													temp[3] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[4].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[4].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[4]}
													tempItem.quantity = e.target.value
													temp[4] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
								
													
												}}											
											/>
										




										<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[5].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[5].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[5]}
													tempItem.quantity = e.target.value
													temp[5] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>




											<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[6].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[6].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[6]}
													tempItem.quantity = e.target.value
													temp[6] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
									
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[7].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[7].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[7]}
													tempItem.quantity = e.target.value
													temp[7] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
						
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[8].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[8].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[8]}
													tempItem.quantity = e.target.value
													temp[8] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>


<Form.Control
												size='lg'
												
												type='text'
												value={ShoesizeStockCount[9].size}
											/>
		
											<Form.Control
												size='lg'
												placeholder='Enter Quantity'
												type='text'
												value={ShoesizeStockCount[9].quantity}
												onChange={(e)=>{
													let temp = [...ShoesizeStockCount]
													let tempItem = {...temp[9]}
													tempItem.quantity = e.target.value
													temp[9] = tempItem
													setShoesizeStockCountSizeStockCount(temp)
										
													
												}}											
											/>
											
										
											
												
		
										</FloatingLabel>
										</Form.Group>
										)}


								<Form.Group controlId='description'>
									<FloatingLabel
										controlId='descinput'
										label='Description'
										className='mb-3'>
										<Form.Control
											size='lg'
											placeholder='Enter description URL'
											type='text'
											value={description}
											onChange={(e) =>
												setDescription(e.target.value)
											}
										/>
									</FloatingLabel>
								</Form.Group>
								
								
								{category === "Caps" && (

								<Form.Group controlId='countInStock'>
								<FloatingLabel
									controlId='countinstockinput'
									label='CountInStock'
									className='mb-3'>
									<Form.Control
										size='lg'
										placeholder='Enter Count In Stock'
										type='number'
										min='0'
										max='1000'
										value={countInStock}
										onChange={(e) =>
											setCountInStock(e.target.value)
										}
									/>
								</FloatingLabel>

								</Form.Group>


								)}


								<Form.Group controlId='isMembersOnly'>
									<FloatingLabel
										controlId='membersOnlyInput'
										label='Is this product members only?'
										className='mb-3'>
										<Form.Select
											size='lg'
											placeholder='Set Members Only Status'
											value={isMembersOnly}
											onChange={membersOnlyHandler}
										>
											<option value="false">No</option>
											<option value="true">Yes</option>

										</Form.Select>
									</FloatingLabel>
								</Form.Group>
                
            <Button type='submit' variant='primary'>
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default ProductEditScreen
