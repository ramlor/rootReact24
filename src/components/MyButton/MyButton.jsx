import 'bootstrap/dist/css/bootstrap.min.css';
import './MyButton.css';   

import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';

const MyButton = ({text, callback, variant}) => {
  
  const [textButton, setTextButton] = useState("Hola");
  return (
    <div>
      <Button onClick={callback} variant= {variant}>{text}</Button>
    </div>
  )
}

export default MyButton;


