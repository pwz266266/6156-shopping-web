// This file defines the Login component where a user_id is given and stored in local storage.
// When register, first name and last name are required and showed.
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { Url } from "../data/url";

export function LoginLogoutRegister() {
    const [userId, setUserId] = React.useState("");
    const [error, setError] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [isRegister, setIsRegister] = React.useState(false);
    
    async function fetchUserInfo() {
        if (localStorage.getItem("user_id") !== null) {
            const response = await fetch(Url + "/users/" + localStorage.getItem("user_id"));
            const data = await response.json();
            const userData = data["data"];
            setFirstName(userData["first_name"]);
            setLastName(userData["last_name"]);
            fetchContact("email");
            fetchContact("address");
            fetchContact("phone");
        }
    }
    React.useEffect(() => {
        fetchUserInfo();
    }, []);

    async function fetchContact(type: string) {
        const response = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/" +  type);
        const data = await response.json();
        const contactData = data;
        if (type === "email") {
            setEmail(contactData["email"]);
        } else if (type === "address") {
            setAddress(contactData["address"]);
        } else if (type === "phone") {
            setPhone(contactData["phone"]);
        }
    }

    async function updateInfo() {
        const response = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/email", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
            }),
        });
        const response2 = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/address", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: address,
            }),
        });
        const response3 = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/phone", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: phone,
            }),
        });
        setError("Updated!");
    }

    async function login() {
        if (userId === "") {
            setError("Please enter a user id");
            return;
        }
        // Get user info from backend
        const response = await fetch(Url+"/users/" + userId);
        if (response.status === 404 || response.status === 400) {
            setError("User not found");
            return;
        }
        const data = await response.json();
        if (data["data"] === null) {
            setError("User does not exist");
            return;
        }
        localStorage.setItem("user_id", userId);
        fetchUserInfo();
        setError("");
    }
    async function deleteAccount() {
        const response = await fetch(Url + "/users/" + localStorage.getItem("user_id"), {
            method: "DELETE",
        });
        const response2 = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/email", {
            method: "DELETE",
        });
        const response3 = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/address", {
            method: "DELETE",
        });
        const response4 = await fetch(Url + "/contact/" + localStorage.getItem("user_id") + "/phone", {
            method: "DELETE",
        });
        if (response.status === 200) {
            logout();
            setError("Account deleted");
        } else {
            setError("Error deleting account");
        }
    }
    async function logout() {
        localStorage.removeItem("user_id");
        setUserId("");
        setFirstName("");
        setLastName("");
        setError("");
        // window.location.reload();
    }

    async function register() {
        if (firstName === "") {
            setError("Please enter a first name");
            return;
        }
        if (lastName === "") {
            setError("Please enter a last name");
            return;
        }
        // Use first name and last name to register
        const response = await fetch(Url+"/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "first_name": firstName,
                "last_name": lastName,
            }),
        });
        if (response.status === 400) {
            setError("User already exists");
            return;
        }
        const data = await response.json();
        localStorage.setItem("user_id", data["data"]["user_id"]);
        // Post email, address, phone to be empty
        const response2 = await fetch(Url+"/contact/" + localStorage.getItem("user_id") + "/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "",
            }),
        });
        const response3 = await fetch(Url+"/contact/" + localStorage.getItem("user_id") + "/address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                address: "",
            }),
        });
        const response4 = await fetch(Url+"/contact/" + localStorage.getItem("user_id") + "/phone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phone: "",
            }),
        });
        fetchUserInfo();
        setError("");
        setIsRegister(false);
        // localStorage.setItem("user_id", userId);
        // window.location.reload();
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            login();
            setError("");
        } catch {
            setError("User doesn't exist.");
        }
    }

    // First check if user id is in local storage, if so, show logout button
    // If not, show login form and provide a link to register
    // If register, show first name and last name input
    return (
        <div className="shadow p-3 mb-5 bg-body rounded" style={{width: "500px", margin: "auto"}}>
        {(isRegister ? <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Form.Label column sm={3}>
                    First Name
                </Form.Label>
                <Col sm={6}>
                    <Form.Control type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={{width: "200px"}}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Form.Label column sm={3}>
                    Last Name
                </Form.Label>
                <Col sm={6}>
                    <Form.Control type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{width: "200px"}}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit" className="ms-2" onClick={() => register()}>Register</Button>
                    <Button variant="danger" className="ms-2" onClick={() => setIsRegister(false)}>Go Back</Button>
                </Col>
            </Form.Group>
        </Form> : 
        <>
            {localStorage.getItem("user_id") ? (
                //show user's email
                <div style={{textAlign: "center"}}>
                    <h3>Hello {firstName} {lastName}!</h3>
                    <p>Your user ID is {localStorage.getItem("user_id")}</p>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Email
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: "200px"}}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Address
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} style={{width: "200px"}}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={3}>
                                Phone
                            </Form.Label>
                            <Col sm={6}>
                                <Form.Control type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={{width: "200px"}}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Col sm={{ span: 10 }}>
                                <Button variant="primary" className="ms-3" onClick={updateInfo}>Update Info</Button>
                                <Button variant="danger" className="ms-3" onClick={logout}>Logout</Button>
                                <Button variant="danger" className="ms-3" onClick={deleteAccount}>Delete Account</Button>
                            </Col>
                        </Form.Group>
                    </Form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            ) : (
                <>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                            <Form.Label column sm={2}>
                                User ID
                            </Form.Label>
                            <Col sm={10}>
                                <Form.Control type="text" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" >
                            <Col sm={{ span: 10, offset: 2 }} >
                                <Button type="submit" className="ms-2" >Login</Button>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Col sm={{ span: 10, offset: 2 }}>
                        <a className="ms-2" onClick={() => setIsRegister(true)}>Go to register?</a>
                            </Col>
                        </Form.Group>

                    </Form>
                    {error && <p className="text-danger">{error}</p>}
                </>
            )}
        </>
        )}
        </div>   
    );
}