import { useState } from "react";
import { Button, TextField } from "flowpane";

export default function Example() {
  const [email, setEmail] = useState("finance@northwind");
  const [submitted, setSubmitted] = useState(false);
  const isValid = /^\S+@\S+\.\S+$/.test(email);

  return (
    <form
      noValidate
      style={{ display: "grid", gap: 16, width: "100%", maxWidth: 380 }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <TextField
        label="Billing email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={submitted && !isValid ? "Enter a full email address, like name@company.com" : undefined}
      />
      <div>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
