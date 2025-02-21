import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const secretKey = import.meta.env.VITE_SECRET_KEY || "a3b1c2d3e4f56789abcdef0123456789abcdef0123456789abcdef0123456789";
  const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
  };
  const passwordRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPasswordArray(JSON.parse(passwords));
    }
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard !", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const copyPassword = (text, isPassword = false) => {
    let finalText = isPassword ? decryptPassword(text) : text;
    navigator.clipboard.writeText(finalText);
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const showPassword = () => {
    if (passwordRef.current.type == "password") {
      passwordRef.current.type = "text";
    } else {
      passwordRef.current.type = "password";
    }
  };

  const savePassword = () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      const encryptedPassword = encryptPassword(form.password);
      const newPassword = {
        ...form,
        password: encryptedPassword,
        id: uuidv4(),
      };

      setPasswordArray([...passwordArray, newPassword]);
      localStorage.setItem(
        "passwords",
        JSON.stringify([...passwordArray, newPassword])
      );
      setform({ site: "", username: "", password: "" });
      toast("Password saved !", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast("Password not saved !");
    }
  };

  const deletePassword = (id) => {
    let c = confirm("Do you really want to delete this password?");
    if (c) {
      setPasswordArray(passwordArray.filter((item) => item.id !== id));
      localStorage.setItem(
        "passwords",
        JSON.stringify(passwordArray.filter((item) => item.id !== id))
      );
      toast("Password Deleted !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const editPassword = (id) => {
    setform(passwordArray.filter((i) => i.id === id)[0]);
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition="Bounce"
      />
      {/* Same as */}
      <ToastContainer />
      <div className=""></div>
      <div className="p-1 border border-gray-300 mt-5 rounded-lg">
        <div className="flex flex-col p-4 text-black gap-4 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter website URL.."
            className="border border-gray-300 px-2 py-1.5 rounded-lg w-full outline-none"
            type="text"
            name="site"
            id="site"
          />
          <div className="flex flex-col md:flex-row w-full justify-center gap-2">
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username.."
              className="border border-gray-300 px-2 py-1.5 rounded-lg w-full outline-none"
              type="text"
              name="username"
              id="username"
            />
            <div className="flex flex-row items-center gap-1">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password.."
                className="border border-gray-300 px-2 py-1.5 rounded-lg w-full outline-none"
                type="password"
                name="password"
                id="password"
              />
              <span
                className="cursor-pointer border-gray-300 border rounded-lg p-1.5"
                onClick={showPassword}
              >
                <span className="flex material-symbols-outlined">
                  visibility_off
              </span>
              </span>
            </div>
          </div>
          <button
            onClick={savePassword}
            className="w-full bg-black p-1.5 rounded-lg text-white text-base font-semibold hover:opacity-80 cursor-pointer"
          >
            Save
          </button>
        </div>
        {/* User Passwords */}
        <div className="passwords px-4">
          {passwordArray.length === 0 && (
            <div className="text-center text-gray-500 mb-4">
              No passwords to show
            </div>
          )}
          {passwordArray.length !== 0 && (
            <div className="overflow-x-auto">
              <h2 className="font-bold text-2xl py-4 text-center">
                Your Passwords
              </h2>
              <table className="table-auto w-full rounded-md overflow-hidden mb-10 border border-gray-300 min-w-[600px]">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="py-2 px-3">URL</th>
                    <th className="py-2 px-3">Username</th>
                    <th className="py-2 px-3">Password</th>
                    <th className="py-2 px-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-100">
                  {passwordArray.map((item, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <p
                            className="text-blue-800 underline font-semibold truncate max-w-[120px] md:max-w-none cursor-pointer w-96"
                            onClick={() => copyText(item.site)}
                          >
                            {item.site}
                          </p>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span
                            className="truncate max-w-[100px] md:max-w-none cursor-pointer"
                            onClick={() => copyText(item.username)}
                          >
                            {item.username}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center flex-row justify-center gap-2">
                          <span
                            className="truncate flex flex-row items-center cursor-pointer md:max-w-none"
                            onClick={() => copyPassword(item.password, true)}
                          >
                            {"*".repeat(10)}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex justify-center space-x-3">
                          <span
                            className="cursor-pointer bg-gray-300 px-1 py-1 rounded-lg flex"
                            onClick={() => editPassword(item.id)}
                          >
                            <span className="flex material-symbols-outlined">
                              edit_square
                            </span>
                          </span>
                          <span
                            className="cursor-pointer bg-red-300 px-1 py-1 rounded-lg flex"
                            onClick={() => deletePassword(item.id)}
                          >
                            <span className="flex material-symbols-outlined">
                              delete
                            </span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
