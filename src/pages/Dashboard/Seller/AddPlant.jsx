import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../Api/Utils'
import useAuth from '../../../hooks/useAuth'
import { useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddPlant = () => {
  const { user } = useAuth()
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image")
  const [loading, setLoading] = useState(false)
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  // handle form submit 
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target
    const name = form.name.value
    const description = form.description.value
    const category = form.category.value
    const price = parseFloat(form.price.value)
    const quantity = parseInt(form.quantity.value)
    const image = form.image.files[0]

    const imageURL = await imageUpload(image)

    // seller information 
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email
    }

    // create a plant data object
    const plantData = {
      name, category, description, price, quantity, image: imageURL, seller
    }
    try {
      const { data } = await axiosSecure.post("/plants", plantData)
      console.log(data)
      toast.success("Data added successfully!")
      navigate("/dashboard/my-inventory")
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        handleSubmit={handleSubmit}
        uploadButtonText={uploadButtonText}
        setUploadButtonText={setUploadButtonText}
        loading={loading}
      />
    </div>
  )
}

export default AddPlant
