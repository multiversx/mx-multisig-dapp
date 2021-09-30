import React from "react";
import { faAcorn, IconDefinition } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";

interface ActionCardType {
  icon: IconDefinition;
  title: string;
  message: string;
  bgColor?: string;
  onClick: () => void;
}

export default function ActionCard({
  icon,
  title,
  message,
  bgColor,
  onClick,
}: ActionCardType) {
  return (
    <div onClick={onClick} className={"action-card"}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{message}</Card.Text>
      </Card.Body>
      <div className={"image-container"} style={{ backgroundColor: bgColor }}>
        <FontAwesomeIcon icon={icon} />
      </div>
    </div>
  );
}
