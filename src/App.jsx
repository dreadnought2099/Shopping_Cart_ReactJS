import { useState } from "react";
import Table from "react-bootstrap/Table";
import Textbox from "./components/textbox/textbox";
import Dropdown from "./components/dropdown/dropdown";
import CustomButton from "./components/button/button";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [txtName, setTxtName] = useState("");
  const [textPrice, setTextPrice] = useState("");
  const [textQuantity, setTextQuantity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [selectedTown, setSelectedTown] = useState(""); // State for selected town

  function onChange(e) {
    const { id, value } = e.target;

    if (id === "txtName") setTxtName(value);
    if (id === "txtPrice") setTextPrice(value);
    if (id === "txtQuantity") setTextQuantity(value);
  }

  // Handle town selection separately
  function handleTownChange(e) {
    setSelectedTown(e.target.value); // Update the selected town
  }

  function addToCart() {
    if (txtName && textPrice && textQuantity) {
      const item = {
        name: txtName,
        price: parseFloat(textPrice),
        quantity: parseInt(textQuantity),
      };
      if (editIndex !== null) {
        const updatedItems = cartItems.map((i, index) =>
          index === editIndex ? item : i
        );
        setCartItems(updatedItems);
        setEditIndex(null);
      } else {
        setCartItems([...cartItems, item]);
      }
      clearInput();
    }
  }

  function editItem(index) {
    const item = cartItems[index];
    setTxtName(item.name);
    setTextPrice(item.price);
    setTextQuantity(item.quantity);
    setEditIndex(index);
  }

  function deleteItem(itemIndex) {
    setCartItems(cartItems.filter((_, index) => index !== itemIndex));
  }

  function clearInput() {
    setTxtName("");
    setTextPrice("");
    setTextQuantity("");
  }

  function clearCart() {
    setCartItems([]);
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const getShippingFee = () => {
    if (selectedTown === "tubigon") return 50;
    if (selectedTown === "calape") return 100;
    return 0; // Default shipping fee if no town is selected
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = getShippingFee(); // Dynamically calculate shipping fee
  const total = subtotal + shippingFee;

  return (
    <div>
      <div className="main-container">
        <div className="sub-container">
          <Textbox
            id="txtName"
            type="text"
            label="item name"
            value={txtName}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtPrice"
            type="number"
            label="item price"
            value={textPrice}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <Textbox
            id="txtQuantity"
            type="number"
            label="quantity"
            value={textQuantity}
            containerClass="p-3"
            onTextChange={onChange}
          />
          <div className="d-flex justify-content-center py-2">
            <CustomButton
              label={editIndex !== null ? "Update" : "Add to Cart"}
              onClick={addToCart}
              variant="primary"
            />
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="item-container my-5">
            <h3 className="text-center py-3">CART ITEMS</h3>
            <Table striped bordered>
              <thead>
                <tr className="text-capitalize">
                  <th>item#</th>
                  <th>item name</th>
                  <th>price</th>
                  <th>quantity</th>
                  <th>total</th>
                  <td>actions</td>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{formatCurrency(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.price * item.quantity)}</td>
                    <td className="text-center" width={200}>
                      <CustomButton
                        label="edit"
                        variant="success"
                        innerClass="m-1"
                        onClick={() => editItem(index)} // Edit button functionality
                      />
                      <CustomButton
                        label="delete"
                        variant="danger"
                        innerClass="m-1"
                        onClick={() => deleteItem(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex">
              <Dropdown
                id="drpTown"
                label="town"
                options={["tubigon", "calape"]}
                containerClass="p-3"
                onSelectChange={handleTownChange} // Use the new handleTownChange function
              />
              <Dropdown
                id="drpPayment"
                label="payment method"
                options={["gcash", "creditcard"]}
                containerClass="p-3"
                onSelectChange={onChange}
              />
              <CustomButton
                label="Clear"
                onClick={clearCart}
                variant="secondary"
                innerClass="m-1 clear-button"
              />
            </div>
            <div className="d-flex justify-content-end">
              <div className="summary-container p-3">
                <h5>Subtotal: {formatCurrency(subtotal)}</h5>
                <h5>Shipping Fee: {formatCurrency(shippingFee)}</h5>
                <h5>Total: {formatCurrency(total)}</h5>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
