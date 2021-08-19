describe("Server-side tests", function() {
  describe("Logged-out state", function() {
    it("lets the client call `login()`")
    it("lets the client subscribe to `meteor.loginServiceConfiguration`")
    it("blocks other subscriptions")
    it("blocks other methods")
  })

  describe("Logged-in state", function() {
    it("lets the client call any method")
    it("lets the client subscribe to anything")
  })
})
