const app = require("../src/app");
const request = require("supertest");

describe("Chapter 3: API Tests", () => {
  it("Returns the array of books", async () => {

    const res = await request(app).get("/api/books");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

  it("Returns a single book", async () => {

    const res = await request(app).get("/api/books/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  it("Return 400 error if ID is not a number", async () => {

    const res = await request(app).get("/api/books/boo");

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });
});

describe ("Chapter 4: API Tests", () => {
  it("Returns 201 status code when adding a new book", async () => {

    const res = await request(app).post("/api/books").send({
      id: 6,
      title: "Jurassic Park",
      author: "Michael Crichton",
    });

    expect(res.statusCode).toEqual(201);
  });

  it("Returns 400 status code when adding a book without a title", async () => {

    const res = await request(app).post("/api/books").send({
      id: 100,
      author: "Michael Crichton"
    });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual("Bad Request");
  });

  it("Returns 204 status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/3");
    expect(res.statusCode).toEqual(204);
  });

});