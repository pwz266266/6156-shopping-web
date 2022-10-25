import React from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { User } from "../data/User";
import { Login, LoginLogoutRegister } from "../components/Login";

async function getUsers() {
  const response = await fetch("https://738wowsvq4.execute-api.us-east-1.amazonaws.com/users/");
  const data = await response.json();
  const userData = data["data"];
  const users = userData.map((user) => ({first_name: user["data"]["first_name"], last_name: user["data"]["last_name"], user_id: user["data"]["user_id"]}));
  return users;
}
export function Home() {
  const [items, setItems] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [prevUrl, setPrevUrl] = React.useState("");
  const [nextUrl, setNextUrl] = React.useState("");
  async function updateUserTable(url: string) {
    var data = await fetch(url).then(res => {
      return res.json();
    });
    const userData = data["data"];
    const users = userData.map((user) => ({first_name: user["data"]["first_name"], last_name: user["data"]["last_name"], user_id: user["data"]["user_id"]}));
    setItems(users);
    data["links"].forEach((link) => {link.rel === "prev" ? setPrevUrl(link.href) : setNextUrl(link.href)});
    console.log(data);
  }
  React.useEffect(() => {
    updateUserTable("https://738wowsvq4.execute-api.us-east-1.amazonaws.com/users/");
  }, []);
  function nextPage() {
    setPage(page + 1);
    updateUserTable(nextUrl);
  }
  function prevPage() {
    if (page > 1) {
      setPage(page - 1);
      updateUserTable(prevUrl);
    }
  }
  return ( <> 
  <h1>Home</h1>
  {LoginLogoutRegister()}
  <h2> All Users: </h2>
  <Table striped bordered hover size="sm">
    <thead>
      <tr>
        <th>First Name</th>
        <th>Last Name</th>
        <th>User ID</th>
      </tr>
    </thead>
    <tbody>
    {items.map((user: User) => (
      <tr>
        <td>{user.first_name}</td>
        <td>{user.last_name}</td>
        <td>{user.user_id}</td>
      </tr>
    ))}
    </tbody>
  </Table>
  <div
    className="d-flex align-items-center justify-content-center"
    style={{ gap: ".5rem" }}
  >
    {prevUrl !== "" ? <Button onClick={() => nextPage()}>Prev</Button> : <Button disabled>Prev</Button>}
    <div>
      <span className="fs-3">{page}</span>
    </div>
    {nextUrl !== "" ? <Button onClick={() => prevPage()}>Next</Button> : <Button disabled>Next</Button>}
  </div>
  </> );
}
