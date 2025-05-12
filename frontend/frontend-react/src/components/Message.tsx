import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const Message = ({ sender, text }: { sender: string; text: string }) => {
  return (
    <Card style={{ margin: "10px", maxWidth: "400px" }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {sender}
        </Typography>
        <Typography variant="body1">{text}</Typography>
      </CardContent>
    </Card>
  );
};

export default Message;