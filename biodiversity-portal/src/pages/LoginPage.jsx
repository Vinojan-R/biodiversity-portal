function LoginPage() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Login API will be connected during backend development.");
  }

  return (
    <section className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        <p>Sign in to submit and manage your wildlife observations.</p>

        <label>
          Email address
          <input type="email" placeholder="name@example.com" required />
        </label>

        <label>
          Password
          <input type="password" placeholder="Enter your password" required />
        </label>

        <button type="submit" className="primary-button">
          Sign in
        </button>
      </form>
    </section>
  );
}

export default LoginPage;