import axios from 'axios'

const pushImage = async (img, Id) => {
  await axios.post(this.DNS_IP + '/labApi/add_img', {data: img, Id: Id})
    .then(console.log(img + '' + Id))
}

export default pushImage
