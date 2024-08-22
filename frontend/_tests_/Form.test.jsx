import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Form from "../components/Form";

describe("Form", () => {
    test("renders form with correct inputs and button", () => {
        render(
            <MemoryRouter>
                <Form route="/login" method="login" />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");
        const submitButton = screen.getByText("Login");

        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    });

    test("updates username and password state on input change", () => {
        render(
            <MemoryRouter>
                <Form route="/login" method="login" />
            </MemoryRouter>
        );

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });

        expect(usernameInput.value).toBe("testuser");
        expect(passwordInput.value).toBe("testpassword");
    });

    test("submits form and navigates to home page on successful login", async () => {
        const mockPost = jest.fn().mockResolvedValueOnce({
            data: { access: "access_token", refresh: "refresh_token" },
        });
        const mockNavigate = jest.fn();

        render(
            <MemoryRouter>
                <Form route="/login" method="login" />
            </MemoryRouter>
        );

        api.post = mockPost;
        useNavigate.mockReturnValue(mockNavigate);

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");
        const submitButton = screen.getByText("Login");

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.click(submitButton);

        expect(mockPost).toHaveBeenCalledWith("/login", {
            username: "testuser",
            password: "testpassword",
        });
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "ACCESS_TOKEN",
            "access_token"
        );
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "REFRESH_TOKEN",
            "refresh_token"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    test("submits form and navigates to login page on registration", async () => {
        const mockPost = jest.fn();
        const mockNavigate = jest.fn();

        render(
            <MemoryRouter>
                <Form route="/register" method="register" />
            </MemoryRouter>
        );

        api.post = mockPost;
        useNavigate.mockReturnValue(mockNavigate);

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");
        const submitButton = screen.getByText("Register");

        fireEvent.change(usernameInput, { target: { value: "testuser" } });
        fireEvent.change(passwordInput, { target: { value: "testpassword" } });
        fireEvent.click(submitButton);

        expect(mockPost).toHaveBeenCalledWith("/register", {
            username: "testuser",
            password: "testpassword",
        });
        expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    test("displays error message on API request failure", async () => {
        const mockPost = jest.fn().mockRejectedValueOnce("Error message");
        const mockAlert = jest.spyOn(window, "alert").mockImplementation(() => {});

        render(
            <MemoryRouter>
                <Form route="/login" method="login" />
            </MemoryRouter>
        );

        api.post = mockPost;

        const submitButton = screen.getByText("Login");

        fireEvent.click(submitButton);

        expect(mockPost).toHaveBeenCalledWith("/login", {
            username: "",
            password: "",
        });
        expect(mockAlert).toHaveBeenCalledWith("Error message");

        mockAlert.mockRestore();
    });
});