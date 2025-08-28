import React from "react";
import { Button, Card, CardBody, CardImg, CardText, CardTitle } from "reactstrap";
import "./CustomCard.css"

const CustomCard = ({img ,heding, subHeading, content}) => {
  return (
    <div className="custom_card">
      <Card className="card-bordered">
        <CardImg top src={``} alt=""  className="w-100" style={{overflow:"hidden"}}/>
        <CardBody className="card-inner">
          <CardTitle tag="h5">Card with stretched link</CardTitle>
          <CardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </CardText>
          <Button color="primary">Go somewhere</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CustomCard;
