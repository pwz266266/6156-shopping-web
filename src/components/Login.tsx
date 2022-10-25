// This file defines the Login component where a user_id is given and stored in local storage.
// When register, first name and last name are required and showed.
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export function LoginLogoutRegister() {
    const [userId, setUserId] = React.useState("");
    const [error, setError] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [isRegister, setIsRegister] = React.useState(false);
    
    async function login() {
        if (userId === "") {
            setError("Please enter a user id");
            return;
        }
        localStorage.setItem("user_id", userId);
        window.location.reload();
    }

    async function logout() {
        localStorage.removeItem("user_id");
        window.location.reload();
    }

    async function register() {
        if (userId === "") {
            setError("Please enter a user id");
            return;
        }
        if (firstName === "") {
            setError("Please enter a first name");
            return;
        }
        if (lastName === "") {
            setError("Please enter a last name");
            return;
        }
        localStorage.setItem("user_id", userId);
        window.location.reload();
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
    
    async function updateInfo() {
        window.location.reload();
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
                    <Button type="submit" className="ms-2" >Register</Button>
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