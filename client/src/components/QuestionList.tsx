import { List, ListItem } from "@mui/material";
import InboxQuestion from "./InboxQuestion";
import dateToDuration from "../utils/dateToDuration";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

interface QuestionListProps {
  data: any[]; //to be updated
  view: "inbox" | "profile" | "search";
  viewer: "owner" | "user" | "visitor";
}

export default function QuestionList({
  data,
  view,
  viewer,
}: QuestionListProps) {
  return (
    <List sx={{ mt: 4, width: "100%" }}>
      {data.map((doc) => (
        <ListItem key={doc.id} disableGutters>
          <Question doc={doc} view={view} viewer={viewer} />
        </ListItem>
      ))}
    </List>
  );
}

interface QuestionProps {
  doc: any; //to be updated
  view: "inbox" | "profile" | "search";
  viewer: "owner" | "user" | "visitor";
}

function Question({ doc, view, viewer }: QuestionProps) {
  const { createdAt, fromUser, id, question, category } = doc;
  const { user } = useContext(UserContext);

  let name = "Deleted User";
  let avatar = "";
  const date = dateToDuration(createdAt);

  if (fromUser === null) {
    name = "Anonymous User";
  } else {
    name = `${fromUser.firstName} ${fromUser.lastName}`;
    avatar = fromUser.avatar;
  }

  const cat = user?.categories?.find((cat) => cat.id === category) ?? {
    id: "",
    name: "general",
  };

  if (view === "inbox") {
    return (
      <InboxQuestion
        id={id}
        name={name}
        date={date}
        avatar={avatar}
        category={cat}
        question={question}
      />
    );
  }

  return <div></div>;
}
