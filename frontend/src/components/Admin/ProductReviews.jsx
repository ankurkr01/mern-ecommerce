import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import SideBar from "./Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteReview, getAllReviews, clearError } from "../../actions/reviewActions";
import { useNavigate } from "react-router-dom";
import { deleteReviewsReset } from "../../store/slices/deleteReviewsSlice";
import { Button } from "@mui/material";
import MetaData from "../navbar/MetaData";
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';



const ProductReviews = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate()



  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );

  const { error, reviews, isLoading } = useSelector(
    (state) => state.allReviews
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReview(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearError());
    }

    if (isDeleted) {
      toast.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch(deleteReviewsReset());
    }
  }, [dispatch, error, deleteError, isDeleted, productId, navigate]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) => {
        return params.rating >= 3
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                deleteReviewHandler(params.id)
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <>
    <ToastContainer/>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <StarIcon />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={
                isLoading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductReviews;