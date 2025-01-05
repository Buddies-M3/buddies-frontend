import Link from "next/link";
import Box from "@mui/material/Box";
// GLOBAL CUSTOM COMPONENTS
import LazyImage from "components/LazyImage";
import { H3, Span } from "components/Typography"; // LOCAL CUSTOM HOOK

import useProduct from "../use-product"; // LOCAL CUSTOM COMPONENTS

import ProductPrice from "../product-price";
import DiscountChip from "../discount-chip";
import ProductStatus from "./product-status";
import ProductRating from "../product-rating";
import QuantityButtons from "./quantity-buttons"; // STYLED COMPONENTS

import { StyledCard, ContentWrapper, ColorBox, ImgBox } from "./styles"; // =======================================================

// =======================================================
const ProductCard17 = props => {
  const {
    sx,
    off,
    status,
    id,
    title,
    price,
    imgUrl,
    rating,
    hideRating,
    productColors,
    slug
  } = props;
  const {
    cartItem,
    handleCartAmountChange
  } = useProduct(slug);

  const handleIncrementQuantity = () => {
    const product = {
      id,
      slug,
      price,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) + 1
    };
    handleCartAmountChange(product);
  };

  const handleDecrementQuantity = () => {
    const product = {
      id,
      slug,
      price,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) - 1
    };
    handleCartAmountChange(product, "remove");
  };

  return <StyledCard sx={sx}>
      <Link href={`/products/${slug}`}>
        <ImgBox id="imgBox">
          {
          /* PRODUCT BADGE STATUS IF STATUS AVAILABLE */
        }
          <ProductStatus status={status} />

          {
          /* DISCOUNT PERCENT CHIP IF AVAILABLE */
        }
          <DiscountChip discount={off} sx={{
          borderRadius: 0
        }} />

          {
          /* PRODUCT IMAGE / THUMBNAIL */
        }
          <LazyImage alt={title} width={500} height={500} src={imgUrl} id="productImg" />
        </ImgBox>
      </Link>

      <ContentWrapper>
        <Box flex="1 1 0">
          {
          /* PRODUCT TITLE / NAME */
        }
          <Link href={`/products/${slug}`}>
            <H3 mb={1} title={title} fontSize="24px" fontWeight="700" className="title" color="text.secondary">
              {title}
            </H3>
          </Link>

          {
          /* PRODUCT RATING / REVIEW  */
        }
          <ProductRating showRating={!hideRating} rating={rating} />

          {
          /* PRODUCT COLORS */
        }
          <ColorBox>
            {productColors.map((color, ind) => <Span key={ind} sx={{
            background: color
          }} />)}
          </ColorBox>

          {
          /* PRODUCT PRICE WITH DISCOUNT */
        }
          <ProductPrice discount={off} price={price} />
        </Box>

        {
        /* PRODUCT QUANTITY HANDLER BUTTONS */
      }
        <QuantityButtons quantity={cartItem?.qty || 0} handleIncrement={handleIncrementQuantity} handleDecrement={handleDecrementQuantity} />
      </ContentWrapper>
    </StyledCard>;
};

export default ProductCard17;