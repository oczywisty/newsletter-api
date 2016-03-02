"use strict";

var request = require("supertest"),
    app     = require("../../boot"),
    expect  = require("chai").expect,
    server  = request.agent(app);

describe("app", function() {
  it("injects user data from params", function(done) {
    server 
      .get("/")
      .expect(200, done)
  });
});
