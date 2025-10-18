import { jest } from "@jest/globals";
import {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import User from "../models/user.model.js";

// Mock the User model
jest.mock("../models/user.model.js");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // chaining
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (data = {}) => {
  return { body: {}, params: {}, ...data };
};

describe("User Controller (Unit Tests - ES6)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create and return a user", async () => {
      const req = mockRequest({
        body: { name: "Test User", email: "test@example.com" },
      });
      const res = mockResponse();

      const mockUser = { _id: "123", ...req.body };
      User.create.mockResolvedValue(mockUser);

      await createUser(req, res);

      expect(User.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should handle errors", async () => {
      const req = mockRequest({
        body: { name: "Error User" },
      });
      const res = mockResponse();

      User.create.mockRejectedValue(new Error("Create failed"));

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Create failed" });
    });
  });

  describe("getUser", () => {
    it("should return a user by ID", async () => {
      const req = mockRequest({ params: { id: "abc123" } });
      const res = mockResponse();

      const mockUser = { _id: "abc123", name: "Alice" };
      User.findById.mockResolvedValue(mockUser);

      await getUser(req, res);

      expect(User.findById).toHaveBeenCalledWith("abc123");
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      const req = mockRequest({ params: { id: "notfound" } });
      const res = mockResponse();

      User.findById.mockResolvedValue(null);

      await getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should handle errors in getUser", async () => {
      const req = mockRequest({ params: { id: "badid" } });
      const res = mockResponse();

      User.findById.mockRejectedValue(new Error("DB error"));

      await getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("getUserById - Unit Test", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return user when found", async () => {
      const req = mockRequest({ params: { id: "123" } });
      const res = mockResponse();

      const mockUser = { _id: "123", name: "Test User" };
      User.findById.mockResolvedValue(mockUser);

      await getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith(mockUser);
      expect(res.status).not.toHaveBeenCalledWith(404);
    });

    it("should return 404 when user not found", async () => {
      const req = mockRequest({ params: { id: "notfound" } });
      const res = mockResponse();

      User.findById.mockResolvedValue(null);

      await getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith("notfound");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should handle exceptions and return 500", async () => {
      const req = mockRequest({ params: { id: "badid" } });
      const res = mockResponse();

      User.findById.mockRejectedValue(new Error("DB failure"));

      await getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith("badid");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("updateUser - Unit Test", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should update and return the user if found", async () => {
      const req = mockRequest({
        params: { id: "123" },
        body: { name: "Updated Name" },
      });
      const res = mockResponse();

      const mockUser = { _id: "123", name: "Updated Name" };
      User.findByIdAndUpdate.mockResolvedValue(mockUser);

      await updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "123",
        { name: "Updated Name" },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 if user not found", async () => {
      const req = mockRequest({
        params: { id: "notfound" },
        body: { name: "No One" },
      });
      const res = mockResponse();

      User.findByIdAndUpdate.mockResolvedValue(null);

      await updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "notfound",
        { name: "No One" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 if there is a DB error", async () => {
      const req = mockRequest({
        params: { id: "error-id" },
        body: { name: "Error User" },
      });
      const res = mockResponse();

      User.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

      await updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        "error-id",
        { name: "Error User" },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });

  describe("deleteUser - Unit Test", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should delete user and return success message", async () => {
      const req = mockRequest({ params: { id: "123" } });
      const res = mockResponse();

      const mockUser = { _id: "123", name: "ToDelete" };
      User.findByIdAndDelete.mockResolvedValue(mockUser);

      await deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith({ message: "Deleted" });
    });

    it("should return 404 if user not found", async () => {
      const req = mockRequest({ params: { id: "notfound" } });
      const res = mockResponse();

      User.findByIdAndDelete.mockResolvedValue(null);

      await deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("notfound");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 if there is a database error", async () => {
      const req = mockRequest({ params: { id: "error" } });
      const res = mockResponse();

      User.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

      await deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith("error");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal Server Error" });
    });
  });
});
