--
-- PostgreSQL database dump
--

\restrict S5ExmLuWmWH7IwO84lFyRTlykXQq6opkmftcfhFO0AMVbc0qL9IXG5B5CQI77UK

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

-- Started on 2026-02-25 15:22:04

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 29375)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id bigint NOT NULL,
    city character varying(255),
    district character varying(255),
    is_default boolean,
    phone_number character varying(255),
    recipient_name character varying(255),
    street character varying(255),
    ward character varying(255),
    user_id bigint NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 29374)
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.addresses_id_seq OWNER TO postgres;

--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 214
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- TOC entry 255 (class 1259 OID 29781)
-- Name: banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banners (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    display_order integer NOT NULL,
    image_url character varying(1000) NOT NULL,
    is_active boolean NOT NULL,
    link character varying(1000),
    title character varying(255),
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.banners OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 29780)
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.banners_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.banners_id_seq OWNER TO postgres;

--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 254
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- TOC entry 217 (class 1259 OID 29384)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    quantity integer NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 29383)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO postgres;

--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 216
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 219 (class 1259 OID 29391)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id bigint NOT NULL,
    total_price numeric(38,2),
    user_id bigint NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 29390)
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO postgres;

--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 218
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 221 (class 1259 OID 29398)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    description text,
    name character varying(255) NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 29397)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 251 (class 1259 OID 29745)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 29744)
-- Name: conversations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conversations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.conversations_id_seq OWNER TO postgres;

--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 250
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 223 (class 1259 OID 29407)
-- Name: flash_sale_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flash_sale_items (
    id bigint NOT NULL,
    discounted_price numeric(38,2),
    sold_quantity integer NOT NULL,
    stock_quantity integer NOT NULL,
    flash_sale_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.flash_sale_items OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 29406)
-- Name: flash_sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flash_sale_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flash_sale_items_id_seq OWNER TO postgres;

--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 222
-- Name: flash_sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flash_sale_items_id_seq OWNED BY public.flash_sale_items.id;


--
-- TOC entry 225 (class 1259 OID 29414)
-- Name: flash_sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flash_sales (
    id bigint NOT NULL,
    end_time timestamp(6) without time zone,
    is_active boolean,
    name character varying(255),
    start_time timestamp(6) without time zone
);


ALTER TABLE public.flash_sales OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 29413)
-- Name: flash_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.flash_sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.flash_sales_id_seq OWNER TO postgres;

--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 224
-- Name: flash_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flash_sales_id_seq OWNED BY public.flash_sales.id;


--
-- TOC entry 253 (class 1259 OID 29752)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    content text,
    created_at timestamp(6) without time zone,
    is_read boolean,
    conversation_id bigint NOT NULL,
    sender_id bigint NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 29751)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.messages_id_seq OWNER TO postgres;

--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 252
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 227 (class 1259 OID 29421)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    is_read boolean NOT NULL,
    message character varying(255),
    reference_id bigint,
    title character varying(255),
    type character varying(255),
    user_id bigint NOT NULL,
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['REVIEW'::character varying, 'ORDER'::character varying, 'SYSTEM'::character varying, 'PRODUCT_BAN'::character varying, 'PRODUCT_UNBAN'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 29420)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 226
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 229 (class 1259 OID 29431)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    price numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 29430)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 228
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 231 (class 1259 OID 29438)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    final_price numeric(38,2) NOT NULL,
    payment_method character varying(255),
    status character varying(255) NOT NULL,
    total_price numeric(38,2) NOT NULL,
    shipping_address_id bigint,
    user_id bigint NOT NULL,
    voucher_id bigint,
    CONSTRAINT orders_payment_method_check CHECK (((payment_method)::text = ANY ((ARRAY['COD'::character varying, 'BANKING'::character varying, 'VNPAY'::character varying])::text[]))),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'SHIPPING'::character varying, 'DELIVERING'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 29437)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 233 (class 1259 OID 29449)
-- Name: product_attribute_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_attribute_options (
    id bigint NOT NULL,
    image_url character varying(255),
    value character varying(255) NOT NULL,
    attribute_id bigint NOT NULL
);


ALTER TABLE public.product_attribute_options OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 29448)
-- Name: product_attribute_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_attribute_options_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_attribute_options_id_seq OWNER TO postgres;

--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_attribute_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_attribute_options_id_seq OWNED BY public.product_attribute_options.id;


--
-- TOC entry 235 (class 1259 OID 29458)
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_attributes (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_attributes OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 29457)
-- Name: product_attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_attributes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_attributes_id_seq OWNER TO postgres;

--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_attributes_id_seq OWNED BY public.product_attributes.id;


--
-- TOC entry 249 (class 1259 OID 29650)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    product_id bigint NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 29465)
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    attributes text,
    image_url character varying(255),
    price numeric(38,2) NOT NULL,
    stock_quantity integer NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 29464)
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_variants_id_seq OWNER TO postgres;

--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- TOC entry 239 (class 1259 OID 29474)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    average_rating double precision DEFAULT 0.0,
    description character varying(255),
    image_url character varying(255),
    product_status character varying(20) DEFAULT 'PENDING',
    name character varying(255) NOT NULL,
    price numeric(38,2) NOT NULL,
    review_count bigint DEFAULT 0,
    stock_quantity integer NOT NULL,
    violation_reason character varying(255),
    category_id bigint NOT NULL,
    shop_id bigint NOT NULL,
    sold bigint DEFAULT 0,
    discount_percentage integer DEFAULT 0,
    discounted_price numeric(38,2)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 29473)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 238
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 240 (class 1259 OID 29484)
-- Name: review_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_images (
    review_id bigint NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.review_images OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 29488)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    comment character varying(255),
    created_at timestamp(6) without time zone,
    rating integer NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 29487)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 241
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 244 (class 1259 OID 29495)
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    id bigint NOT NULL,
    description character varying(255),
    name character varying(255) NOT NULL,
    owner_id bigint NOT NULL
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 29494)
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shops_id_seq OWNER TO postgres;

--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 243
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shops_id_seq OWNED BY public.shops.id;


--
-- TOC entry 257 (class 1259 OID 29790)
-- Name: sliders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sliders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    display_order integer NOT NULL,
    image_url character varying(1000) NOT NULL,
    is_active boolean NOT NULL,
    link character varying(1000),
    title character varying(255),
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.sliders OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 29789)
-- Name: sliders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sliders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sliders_id_seq OWNER TO postgres;

--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 256
-- Name: sliders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sliders_id_seq OWNED BY public.sliders.id;


--
-- TOC entry 246 (class 1259 OID 29504)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    is_locked boolean,
    password character varying(255) NOT NULL,
    role character varying(255) NOT NULL,
    seller_status character varying(255),
    username character varying(255) NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'SELLER'::character varying, 'ADMIN'::character varying])::text[]))),
    CONSTRAINT users_seller_status_check CHECK (((seller_status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'SUSPENDED'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 29503)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 245
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 248 (class 1259 OID 29515)
-- Name: vouchers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vouchers (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    discount_type character varying(255) NOT NULL,
    discount_value numeric(38,2) NOT NULL,
    end_date timestamp(6) without time zone NOT NULL,
    min_order_value numeric(38,2),
    start_date timestamp(6) without time zone NOT NULL,
    usage_limit integer,
    shop_id bigint,
    CONSTRAINT vouchers_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['PERCENTAGE'::character varying, 'FIXED'::character varying])::text[])))
);


ALTER TABLE public.vouchers OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 29514)
-- Name: vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vouchers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vouchers_id_seq OWNER TO postgres;

--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 247
-- Name: vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vouchers_id_seq OWNED BY public.vouchers.id;


--
-- TOC entry 3281 (class 2604 OID 29378)
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 29784)
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 29387)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 3283 (class 2604 OID 29394)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 3284 (class 2604 OID 29401)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3302 (class 2604 OID 29748)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 3285 (class 2604 OID 29410)
-- Name: flash_sale_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items ALTER COLUMN id SET DEFAULT nextval('public.flash_sale_items_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 29417)
-- Name: flash_sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sales ALTER COLUMN id SET DEFAULT nextval('public.flash_sales_id_seq'::regclass);


--
-- TOC entry 3303 (class 2604 OID 29755)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 3287 (class 2604 OID 29424)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3288 (class 2604 OID 29434)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 29441)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 29452)
-- Name: product_attribute_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options ALTER COLUMN id SET DEFAULT nextval('public.product_attribute_options_id_seq'::regclass);


--
-- TOC entry 3291 (class 2604 OID 29461)
-- Name: product_attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes ALTER COLUMN id SET DEFAULT nextval('public.product_attributes_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 29468)
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- TOC entry 3293 (class 2604 OID 29477)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 29491)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 3299 (class 2604 OID 29498)
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shops_id_seq'::regclass);


--
-- TOC entry 3305 (class 2604 OID 29793)
-- Name: sliders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders ALTER COLUMN id SET DEFAULT nextval('public.sliders_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 29507)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3301 (class 2604 OID 29518)
-- Name: vouchers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers ALTER COLUMN id SET DEFAULT nextval('public.vouchers_id_seq'::regclass);


--
-- TOC entry 3535 (class 0 OID 29375)
-- Dependencies: 215
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, city, district, is_default, phone_number, recipient_name, street, ward, user_id) FROM stdin;
1	Thành phố Hà Nội	Quận Hà Đông	f	123456789	duongthian6915	dấdds	Phường Yên Nghĩa	7
\.


--
-- TOC entry 3575 (class 0 OID 29781)
-- Dependencies: 255
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banners (id, created_at, display_order, image_url, is_active, link, title, updated_at) FROM stdin;
\.


--
-- TOC entry 3537 (class 0 OID 29384)
-- Dependencies: 217
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, quantity, cart_id, product_id) FROM stdin;
1	1	8	7
2	1	8	6
\.


--
-- TOC entry 3539 (class 0 OID 29391)
-- Dependencies: 219
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, total_price, user_id) FROM stdin;
1	0.00	5
2	0.00	1
3	0.00	11
4	0.00	10
5	0.00	8
6	0.00	7
7	0.00	12
9	0.00	13
10	0.00	14
8	649000.00	2
11	0.00	16
\.


--
-- TOC entry 3541 (class 0 OID 29398)
-- Dependencies: 221
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, description, name, image_url) FROM stdin;
8	Danh mục chuyên về mẹ & bé	Mẹ & Bé	\N
9	Danh mục chuyên về thể thao & du lịch	Thể thao & Du lịch	\N
10	Danh mục chuyên về giày dép nam	Giày dép nam	\N
12	Danh mục chuyên về túi ví nữ	Túi ví nữ	\N
15	Danh mục chuyên về bách hóa online	Bách hóa online	\N
17	Danh mục chuyên về nhà sách online	Nhà sách online	\N
18	Danh mục chuyên về thú cưng	Thú cưng	\N
1	Danh mục chuyên về thời trang nam	Thời trang nam	http://localhost:8080/api/files/0d57041c-e074-4334-9980-c684a6f6244a.jpg
16	Danh mục chuyên về ô tô & xe máy	Ô tô & Xe máy	http://localhost:8080/api/files/3183c261-3457-43cc-aa54-4d7c94540882.jpg
14	Danh mục chuyên về đồng hồ	Đồng hồ	http://localhost:8080/api/files/c1c46e84-7968-4981-8d19-11ab907bc7c9.png
2	Danh mục chuyên về thời trang nữ	Thời trang nữ	http://localhost:8080/api/files/839e5019-e88c-40aa-ac5f-6e1ffc943155.jpg
3	Danh mục chuyên về điện thoại & phụ kiện	Điện thoại & Phụ kiện	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg
11	Danh mục chuyên về giày dép nữ	Giày dép nữ	http://localhost:8080/api/files/b995b0e6-52a6-4136-b467-cae34ee7a962.jpg
13	Danh mục chuyên về phụ kiện & trang sức	Phụ kiện & Trang sức	http://localhost:8080/api/files/b2e5aeaa-6f98-43db-bfda-ceabdc5a33f8.jpg
4	Danh mục chuyên về máy tính & laptop	Máy tính & Laptop	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg
5	Danh mục chuyên về thiết bị điện tử	Thiết bị điện tử	http://localhost:8080/api/files/306d6ea6-ec38-45c0-8106-8bea60f59c46.jpg
6	Danh mục chuyên về nhà cửa & đời sống	Nhà cửa & Đời sống	http://localhost:8080/api/files/200244e2-6cb3-465d-bc9f-693f9bdb4682.jpg
7	Danh mục chuyên về sức khỏe & làm đẹp	Sức khỏe & Làm đẹp	http://localhost:8080/api/files/761380ef-5c80-45cf-bdf2-3f46b5c94351.jpg
\.


--
-- TOC entry 3571 (class 0 OID 29745)
-- Dependencies: 251
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, created_at, updated_at, user1_id, user2_id) FROM stdin;
1	2026-02-21 16:39:54.192826	2026-02-21 16:57:39.630619	10	11
2	2026-02-23 22:06:07.156636	2026-02-23 22:06:07.156636	1	12
3	2026-02-25 10:30:49.835575	2026-02-25 10:30:49.835575	5	3
\.


--
-- TOC entry 3543 (class 0 OID 29407)
-- Dependencies: 223
-- Data for Name: flash_sale_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flash_sale_items (id, discounted_price, sold_quantity, stock_quantity, flash_sale_id, product_id) FROM stdin;
1	164700.00	0	10	1	67
2	247500.00	0	10	1	28
3	374400.00	0	10	1	77
4	711900.00	0	10	1	76
5	203400.00	0	10	1	66
6	421200.00	0	10	1	80
7	3696300.00	0	10	1	14
8	375300.00	0	10	1	56
9	362700.00	0	10	1	17
10	677700.00	0	10	1	38
11	708300.00	0	10	1	40
12	149400.00	0	10	1	49
13	144900.00	0	10	1	5
14	6030900.00	0	10	1	15
15	140400.00	0	10	1	41
16	210600.00	0	10	1	79
17	389700.00	0	10	1	90
18	175500.00	0	10	1	88
19	405900.00	0	10	1	24
20	898200.00	0	10	1	32
21	338400.00	0	10	2	19
22	7315200.00	0	10	2	12
23	108900.00	0	10	2	71
24	715500.00	0	10	2	86
25	525600.00	0	10	2	52
26	869400.00	0	10	2	61
27	375300.00	0	10	2	56
28	580500.00	0	10	2	83
29	189900.00	0	10	2	72
30	824400.00	0	10	2	53
31	159300.00	0	10	2	4
32	549900.00	0	10	2	85
33	210600.00	0	10	2	79
34	149400.00	0	10	2	49
35	326700.00	0	10	2	73
36	653400.00	0	10	2	45
37	729000.00	0	10	2	59
38	3696300.00	0	10	2	14
39	140400.00	0	10	2	41
40	7949700.00	0	10	2	11
41	576000.00	0	10	3	22
42	181800.00	0	10	3	74
43	898200.00	0	10	3	32
44	558900.00	0	10	3	55
45	453600.00	0	10	3	30
46	389700.00	0	10	3	90
47	824400.00	0	10	3	53
49	405900.00	0	10	3	24
50	677700.00	0	10	3	38
51	458100.00	0	10	3	50
52	167400.00	0	10	3	6
53	67500.00	0	10	3	81
54	729000.00	0	10	3	59
55	504000.00	0	10	3	68
56	421200.00	0	10	3	80
57	362700.00	0	10	3	17
58	213300.00	0	10	3	57
59	3696300.00	0	10	3	14
60	824400.00	0	10	3	82
61	67500.00	0	10	4	81
62	416700.00	0	10	4	7
63	834300.00	0	10	4	31
64	49500.00	0	10	4	21
65	140400.00	0	10	4	41
66	3696300.00	0	10	4	14
67	7949700.00	0	10	4	11
68	898200.00	0	10	4	32
69	624600.00	0	10	4	47
70	869400.00	0	10	4	61
71	338400.00	0	10	4	19
72	525600.00	0	10	4	52
73	405900.00	0	10	4	24
74	580500.00	0	10	4	83
75	676800.00	0	10	4	44
76	607500.00	0	10	4	3
77	159300.00	0	10	4	4
78	213300.00	0	10	4	57
79	413100.00	0	10	4	54
80	389700.00	0	10	4	90
82	54000.00	0	10	5	39
83	898200.00	0	10	5	32
84	765000.00	0	10	5	10
85	708300.00	0	10	5	40
86	715500.00	0	10	5	86
87	210600.00	0	10	5	79
88	203400.00	0	10	5	66
89	140400.00	0	10	5	41
90	410400.00	0	10	5	18
91	362700.00	0	10	5	17
92	65700.00	0	10	5	34
93	700200.00	0	10	5	87
94	181800.00	0	10	5	74
95	159300.00	0	10	5	4
96	316800.00	0	10	5	29
97	375300.00	0	10	5	56
98	189900.00	0	10	5	25
99	677700.00	0	10	5	38
100	453600.00	0	10	5	30
101	7949700.00	0	10	6	11
102	208800.00	0	10	6	46
103	213300.00	0	10	6	57
104	848700.00	0	10	6	23
105	164700.00	0	10	6	36
106	67500.00	0	10	6	33
107	576000.00	0	10	6	22
108	210600.00	0	10	6	79
109	824400.00	0	10	6	82
110	624600.00	0	10	6	47
111	676800.00	0	10	6	44
112	654300.00	0	10	6	69
113	621000.00	0	10	6	37
114	374400.00	0	10	6	77
115	108900.00	0	10	6	71
116	708300.00	0	10	6	40
117	189900.00	0	10	6	72
118	458100.00	0	10	6	50
119	525600.00	0	10	6	52
120	186300.00	0	10	6	70
121	54000.00	0	10	7	39
122	326700.00	0	10	7	73
123	303300.00	0	10	7	27
124	389700.00	0	10	7	90
125	208800.00	0	10	7	46
126	676800.00	0	10	7	44
127	403200.00	0	10	7	9
128	898200.00	0	10	7	32
129	247500.00	0	10	7	28
130	91800.00	0	10	7	2
131	189900.00	0	10	7	25
132	140400.00	0	10	7	41
133	774900.00	0	10	7	26
134	848700.00	0	10	7	23
135	405900.00	0	10	7	24
136	869400.00	0	10	7	61
137	49500.00	0	10	7	21
138	333900.00	0	10	7	20
139	458100.00	0	10	7	50
140	825300.00	0	10	7	35
\.


--
-- TOC entry 3545 (class 0 OID 29414)
-- Dependencies: 225
-- Data for Name: flash_sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flash_sales (id, end_time, is_active, name, start_time) FROM stdin;
1	2026-02-19 00:00:00	t	Flash Sale 2/18/2026	2026-02-18 23:00:00
2	2026-02-23 20:00:00	t	Flash Sale 2/23/2026	2026-02-23 19:00:00
3	2026-02-23 22:00:00	t	Flash Sale 2/23/2026	2026-02-23 21:00:00
4	2026-02-24 01:00:00	t	Flash Sale 2/24/2026	2026-02-24 00:00:00
5	2026-02-24 14:00:00	t	Flash Sale 2/24/2026	2026-02-24 13:00:00
6	2026-02-24 15:00:00	t	Flash Sale 2/24/2026	2026-02-24 14:00:00
7	2026-02-24 20:00:00	t	Flash Sale 2/24/2026	2026-02-24 19:00:00
\.


--
-- TOC entry 3573 (class 0 OID 29752)
-- Dependencies: 253
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, content, created_at, is_read, conversation_id, sender_id) FROM stdin;
1	chào shop	2026-02-21 16:40:03.115109	t	1	10
2	Chào em. Em cần gì nhỉ	2026-02-21 16:41:22.55829	t	1	11
3	Chào anh	2026-02-21 16:57:39.708837	t	1	10
\.


--
-- TOC entry 3547 (class 0 OID 29421)
-- Dependencies: 227
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, created_at, is_read, message, reference_id, title, type, user_id) FROM stdin;
1	2026-02-17 20:05:01.522718	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	1	Sản phẩm bị khóa: Áo Thun Nam Cotton Cổ Tròn	PRODUCT_BAN	3
2	2026-02-17 20:05:15.565545	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	1	Sản phẩm được khôi phục: Áo Thun Nam Cotton Cổ Tròn	PRODUCT_UNBAN	3
3	2026-02-18 21:52:04.129949	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	13	Sản phẩm bị khóa: Sản phẩm C	PRODUCT_BAN	3
4	2026-02-18 22:02:35.674957	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	3	Sản phẩm bị khóa: Áo Sơ Mi Nam Tay Dài Công Sở	PRODUCT_BAN	4
5	2026-02-18 22:02:45.522597	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	3	Sản phẩm được khôi phục: Áo Sơ Mi Nam Tay Dài Công Sở	PRODUCT_UNBAN	4
6	2026-02-18 22:02:49.121346	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	13	Sản phẩm được khôi phục: Sản phẩm C	PRODUCT_UNBAN	3
7	2026-02-18 22:02:54.936137	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	4	Sản phẩm bị khóa: Quần Jean Nam Ống Suông	PRODUCT_BAN	5
8	2026-02-18 22:04:30.70589	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	4	Sản phẩm được khôi phục: Quần Jean Nam Ống Suông	PRODUCT_UNBAN	5
9	2026-02-18 22:04:34.196944	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	5	Sản phẩm bị khóa: Quần Kaki Nam Slim Fit	PRODUCT_BAN	5
10	2026-02-18 22:04:36.372852	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	5	Sản phẩm được khôi phục: Quần Kaki Nam Slim Fit	PRODUCT_UNBAN	5
12	2026-02-18 22:40:01.936204	t	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	93	Sản phẩm được khôi phục: hello world fix	PRODUCT_UNBAN	8
11	2026-02-18 22:26:49.941574	t	Sản phẩm của bạn đã bị khóa vì lý do: Yêu cầu cập nhật lại thông tin	93	Sản phẩm bị khóa: hello world 	PRODUCT_BAN	8
13	2026-02-18 22:55:21.649433	t	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	93	Sản phẩm bị khóa: hello world fix	PRODUCT_BAN	8
14	2026-02-18 22:56:25.750206	t	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	93	Sản phẩm được khôi phục: hello world	PRODUCT_UNBAN	8
15	2026-02-18 23:30:47.415165	f	duongthian6915 đã đánh giá 5 sao cho sản phẩm của bạn.	174	Đánh giá mới: Sản phẩm khuyến mãi	REVIEW	3
16	2026-02-23 20:23:46.433311	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	95	Sản phẩm bị khóa: TestMessage	PRODUCT_BAN	11
17	2026-02-23 20:23:49.944895	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	95	Sản phẩm được khôi phục: TestMessage	PRODUCT_UNBAN	11
18	2026-02-23 23:48:26.810194	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	94	Sản phẩm bị khóa: testregister product	PRODUCT_BAN	12
19	2026-02-23 23:48:30.596328	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	94	Sản phẩm được khôi phục: testregister product	PRODUCT_UNBAN	12
20	2026-02-24 14:15:42.848273	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	94	Sản phẩm bị khóa: testregister product	PRODUCT_BAN	12
21	2026-02-24 14:15:45.502274	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	94	Sản phẩm được khôi phục: testregister product	PRODUCT_UNBAN	12
22	2026-02-24 14:15:57.096364	f	Sản phẩm của bạn đã bị khóa vì lý do: Vi phạm tiêu chuẩn cộng đồng	93	Sản phẩm bị khóa: hello world	PRODUCT_BAN	8
23	2026-02-24 14:15:59.048401	f	Sản phẩm của bạn đã được mở khóa. Bạn có thể bán lại bình thường.	93	Sản phẩm được khôi phục: hello world	PRODUCT_UNBAN	8
\.


--
-- TOC entry 3549 (class 0 OID 29431)
-- Dependencies: 229
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, price, quantity, order_id, product_id) FROM stdin;
1	916000.00	4	1	82
2	416000.00	5	1	77
3	416000.00	1	2	77
4	579000.00	5	2	75
5	459000.00	1	2	54
6	211000.00	4	2	72
7	966000.00	5	3	61
8	448000.00	2	3	9
9	778000.00	3	3	87
10	161000.00	3	3	5
11	4107000.00	2	3	14
12	202000.00	4	4	74
13	463000.00	1	5	7
14	403000.00	3	5	17
15	752000.00	4	5	44
16	6701000.00	5	5	15
17	509000.00	3	5	50
18	850000.00	1	6	10
19	850000.00	1	7	10
\.


--
-- TOC entry 3551 (class 0 OID 29438)
-- Dependencies: 231
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, created_at, final_price, payment_method, status, total_price, shipping_address_id, user_id, voucher_id) FROM stdin;
3	2026-02-17 11:22:13.049289	16757000.00	\N	DELIVERED	16757000.00	\N	1	\N
5	2026-02-17 11:22:13.128366	39712000.00	\N	DELIVERED	39712000.00	\N	7	\N
2	2026-02-17 11:22:13.006292	4614000.00	\N	DELIVERED	4614000.00	\N	4	\N
4	2026-02-17 11:22:13.117527	808000.00	\N	DELIVERED	808000.00	\N	3	\N
1	2026-02-17 11:22:12.944203	5744000.00	\N	DELIVERED	5744000.00	\N	9	\N
6	2026-02-18 23:27:20.51008	850000.00	COD	DELIVERED	850000.00	1	7	\N
7	2026-02-18 23:30:34.450928	850000.00	COD	DELIVERED	850000.00	1	7	\N
\.


--
-- TOC entry 3553 (class 0 OID 29449)
-- Dependencies: 233
-- Data for Name: product_attribute_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_attribute_options (id, image_url, value, attribute_id) FROM stdin;
8	\N	xanh	3
9	\N	đỏ	3
10	\N	Xanh	4
11	\N	Đỏ	4
12	\N	Tím	4
\.


--
-- TOC entry 3555 (class 0 OID 29458)
-- Dependencies: 235
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_attributes (id, name, product_id) FROM stdin;
3	Màu	97
4	Màu	98
\.


--
-- TOC entry 3569 (class 0 OID 29650)
-- Dependencies: 249
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (product_id, image_url) FROM stdin;
7	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg
7	http://localhost:8080/api/files/8424a38d-fa99-42fe-a77e-d6201f1361ee.jpg
91	http://localhost:8080/api/files/9afbd382-f28e-4152-b874-d6ebd2cf1cfc.jpg
92	http://localhost:8080/api/files/0fa4e8c0-f8fd-474b-9eb6-c06876bac98d.jpg
93	http://localhost:8080/api/files/7381b539-97a7-4b42-a3fb-ea39a926de82.jpg
96	http://localhost:8080/api/files/38583803-bc0e-4fde-8b93-f96070a7f517.jpg
96	http://localhost:8080/api/files/2497351e-6d57-4815-820b-14f00c05507a.jpg
97	http://localhost:8080/api/files/e49a5c50-6bd9-4301-9582-84ab5e699ac7.jpg
98	http://localhost:8080/api/files/5b48edb5-6b47-46d7-b719-9f30378effa5.jpg
99	http://localhost:8080/api/files/0f6295da-0c78-4f19-8f84-a7188436a25c.png
99	http://localhost:8080/api/files/1879b3bf-595d-4934-a727-db8673ac4b08.png
99	http://localhost:8080/api/files/ea2f2fe3-9f9f-457e-9860-062433fec992.png
99	http://localhost:8080/api/files/29238c20-a264-49bf-b620-7ec9b2e747f6.png
99	http://localhost:8080/api/files/d9c94e6c-bcd6-45c4-a532-9b7c0c780d11.png
\.


--
-- TOC entry 3557 (class 0 OID 29465)
-- Dependencies: 237
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, attributes, image_url, price, stock_quantity, product_id) FROM stdin;
13	{"Màu":"xanh"}	\N	290000.00	100	97
14	{"Màu":"đỏ"}	\N	290000.00	50	97
15	{"Màu":"Xanh"}	\N	22990.00	100	98
16	{"Màu":"Đỏ"}	\N	22990.00	94	98
17	{"Màu":"Tím"}	\N	22990.00	80	98
\.


--
-- TOC entry 3559 (class 0 OID 29474)
-- Dependencies: 239
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, average_rating, description, image_url, product_status, name, price, review_count, stock_quantity, violation_reason, category_id, shop_id, sold, discount_percentage, discounted_price) FROM stdin;
4	0	🔥 Quần Jean Nam Ống Suông\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thời trang nam	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg	APPROVED	Quần Jean Nam Ống Suông	177000.00	0	428	\N	1	3	0	0	\N
5	0	🔥 Quần Kaki Nam Slim Fit\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thời trang nam	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	Quần Kaki Nam Slim Fit	161000.00	0	80	\N	1	3	0	0	\N
7	0	🔥 Sản phẩm B\r\n\r\n✅ Hàng chính hãng 100%\r\n🚚 Freeship toàn quốc\r\n💰 Giá tốt nhất thị trường\r\n\r\n📌 Danh mục: Thời trang nữ	http://localhost:8080/api/files/a14b4101-3eb5-4948-acf7-cf8ec4758311.jpg	APPROVED	Sản phẩm B	463000.00	0	383	\N	2	3	0	0	\N
10	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thời trang nữ	http://localhost:8080/api/files/f21b884d-219f-45b9-a1e7-d2320944d4fd.jpg	APPROVED	Sản phẩm khuyến mãi	850000.00	0	174	\N	2	1	0	0	\N
6	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thời trang nữ	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg	APPROVED	Sản phẩm A	186000.00	0	325	\N	2	4	0	0	\N
2	0	🔥 Áo Polo Nam Trơn Cao Cấp\r\n\r\n✅ Hàng chính hãng 100%\r\n🚚 Ship COD toàn quốc\r\n💰 Tặng quà khi mua\r\n\r\n📌 Danh mục: Thời trang nam	http://localhost:8080/api/files/a9a5f76a-9484-420d-b6da-15910e37a182.jpg	APPROVED	Áo Polo Nam Trơn Cao Cấp	102000.00	0	70	\N	1	3	0	0	\N
9	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thời trang nữ	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg	APPROVED	Hàng mới về	448000.00	0	364	\N	2	1	0	0	\N
11	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Điện thoại & Phụ kiện	http://localhost:8080/api/files/e64d5b18-76fa-420c-91f5-246efe1092ec.jpg	APPROVED	Sản phẩm A	8833000.00	0	352	\N	3	1	0	0	\N
12	0	🔥 Sản phẩm B\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Điện thoại & Phụ kiện	http://localhost:8080/api/files/cf377b59-0260-48dd-a99b-a9b7e3d560aa.jpg	APPROVED	Sản phẩm B	8128000.00	0	408	\N	3	3	0	0	\N
14	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Điện thoại & Phụ kiện	http://localhost:8080/api/files/3e5f01f7-ec89-4893-9e3f-003517c0fbde.jpg	APPROVED	Hàng mới về	4107000.00	0	251	\N	3	2	0	0	\N
16	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Máy tính & Laptop	http://localhost:8080/api/files/a14b4101-3eb5-4948-acf7-cf8ec4758311.jpg	APPROVED	Sản phẩm A	758000.00	0	261	\N	4	3	0	0	\N
18	0	🔥 Sản phẩm C\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Máy tính & Laptop	http://localhost:8080/api/files/e64d5b18-76fa-420c-91f5-246efe1092ec.jpg	APPROVED	Sản phẩm C	456000.00	0	336	\N	4	4	0	0	\N
19	0	🔥 Hàng mới về\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Máy tính & Laptop	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	Hàng mới về	376000.00	0	461	\N	4	2	0	0	\N
20	0	🔥 Sản phẩm khuyến mãi\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Máy tính & Laptop	http://localhost:8080/api/files/e0fa36c4-a4ed-4731-a265-9302d67220e7.jpg	APPROVED	Sản phẩm khuyến mãi	371000.00	0	213	\N	4	2	0	0	\N
21	0	🔥 Sản phẩm A\n\n✅ Chất lượng cao\n🚚 Freeship toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thiết bị điện tử	http://localhost:8080/api/files/3c86c750-5673-434e-86be-61b4640b55eb.jpg	APPROVED	Sản phẩm A	55000.00	0	366	\N	5	1	0	0	\N
22	0	🔥 Sản phẩm B\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thiết bị điện tử	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	Sản phẩm B	640000.00	0	265	\N	5	1	0	0	\N
23	0	🔥 Sản phẩm C\n\n✅ Bảo hành 12 tháng\n🚚 Freeship toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thiết bị điện tử	http://localhost:8080/api/files/8029e384-5c89-45f9-be01-de7542ff70ab.jpg	APPROVED	Sản phẩm C	943000.00	0	242	\N	5	2	0	0	\N
24	0	🔥 Hàng mới về\n\n✅ Bảo hành 12 tháng\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thiết bị điện tử	http://localhost:8080/api/files/0d57041c-e074-4334-9980-c684a6f6244a.jpg	APPROVED	Hàng mới về	451000.00	0	255	\N	5	2	0	0	\N
25	0	🔥 Sản phẩm khuyến mãi\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Thiết bị điện tử	http://localhost:8080/api/files/8eb78ece-ec26-46cd-a35a-e7bf602bcb21.jpg	APPROVED	Sản phẩm khuyến mãi	211000.00	0	209	\N	5	1	0	0	\N
15	2.5	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Điện thoại & Phụ kiện	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg	APPROVED	Sản phẩm khuyến mãi	6701000.00	2	140	\N	3	1	0	0	\N
13	0	🔥 Sản phẩm C\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Điện thoại & Phụ kiện	http://localhost:8080/api/files/e5c27cf2-7424-4725-b0a4-f33429b39a36.jpg	APPROVED	Sản phẩm C	22069000.00	0	126	\N	3	1	0	0	\N
31	0	🔥 Sản phẩm A\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Sức khỏe & Làm đẹp	http://localhost:8080/api/files/05a08737-6893-4821-9e9b-a20861d49b54.jpg	APPROVED	Sản phẩm A	927000.00	0	492	\N	7	1	0	0	\N
32	0	🔥 Sản phẩm B\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Sức khỏe & Làm đẹp	http://localhost:8080/api/files/f5664362-00c7-4f30-b65c-94b9874470f6.jpg	APPROVED	Sản phẩm B	998000.00	0	217	\N	7	4	0	0	\N
33	0	🔥 Sản phẩm C\n\n✅ Cam kết như mô tả\n🚚 Freeship toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Sức khỏe & Làm đẹp	http://localhost:8080/api/files/3183c261-3457-43cc-aa54-4d7c94540882.jpg	APPROVED	Sản phẩm C	75000.00	0	403	\N	7	2	0	0	\N
35	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Sức khỏe & Làm đẹp	http://localhost:8080/api/files/a14b4101-3eb5-4948-acf7-cf8ec4758311.jpg	APPROVED	Sản phẩm khuyến mãi	917000.00	0	43	\N	7	4	0	0	\N
36	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Freeship toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Mẹ & Bé	http://localhost:8080/api/files/8eb78ece-ec26-46cd-a35a-e7bf602bcb21.jpg	APPROVED	Sản phẩm A	183000.00	0	488	\N	8	1	0	0	\N
37	0	🔥 Sản phẩm B\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Mẹ & Bé	http://localhost:8080/api/files/cf377b59-0260-48dd-a99b-a9b7e3d560aa.jpg	APPROVED	Sản phẩm B	690000.00	0	500	\N	8	4	0	0	\N
38	0	🔥 Sản phẩm C\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Sale giá sốc\n\n📌 Danh mục: Mẹ & Bé	http://localhost:8080/api/files/e0fa36c4-a4ed-4731-a265-9302d67220e7.jpg	APPROVED	Sản phẩm C	753000.00	0	16	\N	8	2	0	0	\N
39	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Mẹ & Bé	http://localhost:8080/api/files/0fa4e8c0-f8fd-474b-9eb6-c06876bac98d.jpg	APPROVED	Hàng mới về	60000.00	0	455	\N	8	2	0	0	\N
40	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Mẹ & Bé	http://localhost:8080/api/files/3c86c750-5673-434e-86be-61b4640b55eb.jpg	APPROVED	Sản phẩm khuyến mãi	787000.00	0	420	\N	8	2	0	0	\N
41	0	🔥 Sản phẩm A\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thể thao & Du lịch	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg	APPROVED	Sản phẩm A	156000.00	0	283	\N	9	4	0	0	\N
42	0	🔥 Sản phẩm B\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thể thao & Du lịch	http://localhost:8080/api/files/c1c46e84-7968-4981-8d19-11ab907bc7c9.png	APPROVED	Sản phẩm B	207000.00	0	297	\N	9	2	0	0	\N
43	0	🔥 Sản phẩm C\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thể thao & Du lịch	http://localhost:8080/api/files/c1c46e84-7968-4981-8d19-11ab907bc7c9.png	APPROVED	Sản phẩm C	573000.00	0	417	\N	9	2	0	0	\N
44	0	🔥 Hàng mới về\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thể thao & Du lịch	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg	APPROVED	Hàng mới về	752000.00	0	166	\N	9	3	0	0	\N
46	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Giày dép nam	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg	APPROVED	Sản phẩm A	232000.00	0	181	\N	10	1	0	0	\N
47	0	🔥 Sản phẩm B\n\n✅ Chất lượng cao\n🚚 Ship COD toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Giày dép nam	http://localhost:8080/api/files/f21b884d-219f-45b9-a1e7-d2320944d4fd.jpg	APPROVED	Sản phẩm B	694000.00	0	190	\N	10	4	0	0	\N
48	0	🔥 Sản phẩm C\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Giày dép nam	http://localhost:8080/api/files/3c86c750-5673-434e-86be-61b4640b55eb.jpg	APPROVED	Sản phẩm C	437000.00	0	35	\N	10	1	0	0	\N
49	0	🔥 Hàng mới về\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Giày dép nam	http://localhost:8080/api/files/611589588_1339432284889468_7419054128254423384_n.jpg	APPROVED	Hàng mới về	166000.00	0	337	\N	10	1	0	0	\N
51	0	🔥 Sản phẩm A\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Giày dép nữ	http://localhost:8080/api/files/e64d5b18-76fa-420c-91f5-246efe1092ec.jpg	APPROVED	Sản phẩm A	689000.00	0	385	\N	11	1	0	0	\N
52	0	🔥 Sản phẩm B\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Giày dép nữ	http://localhost:8080/api/files/9afbd382-f28e-4152-b874-d6ebd2cf1cfc.jpg	APPROVED	Sản phẩm B	584000.00	0	244	\N	11	3	0	0	\N
28	0	🔥 Sản phẩm C\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Nhà cửa & Đời sống	http://localhost:8080/api/files/e0fa36c4-a4ed-4731-a265-9302d67220e7.jpg	APPROVED	Sản phẩm C	275000.00	0	439	\N	6	3	0	0	\N
27	0	🔥 Sản phẩm B\n\n✅ Chất lượng cao\n🚚 Freeship toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Nhà cửa & Đời sống	http://localhost:8080/api/files/e6ebcba1-3ab0-461b-b0d4-caa4330fdf33.jpg	APPROVED	Sản phẩm B	337000.00	0	255	\N	6	4	0	0	\N
29	0	🔥 Hàng mới về\n\n✅ Chất lượng cao\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Nhà cửa & Đời sống	http://localhost:8080/api/files/8424a38d-fa99-42fe-a77e-d6201f1361ee.jpg	APPROVED	Hàng mới về	352000.00	0	89	\N	6	4	0	0	\N
57	0	🔥 Sản phẩm B\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Túi ví nữ	http://localhost:8080/api/files/f21b884d-219f-45b9-a1e7-d2320944d4fd.jpg	APPROVED	Sản phẩm B	237000.00	0	121	\N	12	2	0	0	\N
59	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Túi ví nữ	http://localhost:8080/api/files/b2e5aeaa-6f98-43db-bfda-ceabdc5a33f8.jpg	APPROVED	Hàng mới về	810000.00	0	63	\N	12	2	0	0	\N
61	0	🔥 Sản phẩm A\n\n✅ Hàng chính hãng 100%\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Phụ kiện & Trang sức	http://localhost:8080/api/files/8424a38d-fa99-42fe-a77e-d6201f1361ee.jpg	APPROVED	Sản phẩm A	966000.00	0	134	\N	13	2	0	0	\N
62	0	🔥 Sản phẩm B\n\n✅ Bảo hành 12 tháng\n🚚 Freeship toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Phụ kiện & Trang sức	http://localhost:8080/api/files/8eb78ece-ec26-46cd-a35a-e7bf602bcb21.jpg	APPROVED	Sản phẩm B	727000.00	0	328	\N	13	4	0	0	\N
63	0	🔥 Sản phẩm C\n\n✅ Chất lượng cao\n🚚 Ship COD toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Phụ kiện & Trang sức	http://localhost:8080/api/files/c34bc910-e846-40b3-8aab-751091ab1c74.jpg	APPROVED	Sản phẩm C	717000.00	0	417	\N	13	2	0	0	\N
64	0	🔥 Hàng mới về\n\n✅ Bảo hành 12 tháng\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Phụ kiện & Trang sức	http://localhost:8080/api/files/c1c46e84-7968-4981-8d19-11ab907bc7c9.png	APPROVED	Hàng mới về	382000.00	0	365	\N	13	3	0	0	\N
67	0	🔥 Sản phẩm B\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Đồng hồ	http://localhost:8080/api/files/b2e5aeaa-6f98-43db-bfda-ceabdc5a33f8.jpg	APPROVED	Sản phẩm B	183000.00	0	437	\N	14	3	0	0	\N
66	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Freeship toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Đồng hồ	http://localhost:8080/api/files/9afbd382-f28e-4152-b874-d6ebd2cf1cfc.jpg	APPROVED	Sản phẩm A	226000.00	0	41	\N	14	2	0	0	\N
68	0	🔥 Sản phẩm C\n\n✅ Bảo hành 12 tháng\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Đồng hồ	http://localhost:8080/api/files/0d57041c-e074-4334-9980-c684a6f6244a.jpg	APPROVED	Sản phẩm C	560000.00	0	295	\N	14	4	0	0	\N
69	0	🔥 Hàng mới về\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Đồng hồ	http://localhost:8080/api/files/f0a52b58-0631-4f8a-999b-8ec78449c6cf.jpg	APPROVED	Hàng mới về	727000.00	0	304	\N	14	2	0	0	\N
71	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Bách hóa online	http://localhost:8080/api/files/f21b884d-219f-45b9-a1e7-d2320944d4fd.jpg	APPROVED	Sản phẩm A	121000.00	0	41	\N	15	1	0	0	\N
72	0	🔥 Sản phẩm B\n\n✅ Chất lượng cao\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Bách hóa online	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg	APPROVED	Sản phẩm B	211000.00	0	336	\N	15	2	0	0	\N
73	0	🔥 Sản phẩm C\n\n✅ Chất lượng cao\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Bách hóa online	http://localhost:8080/api/files/611589588_1339432284889468_7419054128254423384_n.jpg	APPROVED	Sản phẩm C	363000.00	0	174	\N	15	2	0	0	\N
74	0	🔥 Hàng mới về\n\n✅ Bảo hành 12 tháng\n🚚 Ship COD toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Bách hóa online	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	Hàng mới về	202000.00	0	334	\N	15	2	0	0	\N
75	0	🔥 Sản phẩm khuyến mãi\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Bách hóa online	http://localhost:8080/api/files/c34bc910-e846-40b3-8aab-751091ab1c74.jpg	APPROVED	Sản phẩm khuyến mãi	579000.00	0	192	\N	15	2	0	0	\N
76	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Sale giá sốc\n\n📌 Danh mục: Ô tô & Xe máy	http://localhost:8080/api/files/8c7e8731-5cd2-4dea-88e3-daf8059541cb.jpg	APPROVED	Sản phẩm A	791000.00	0	487	\N	16	4	0	0	\N
77	0	🔥 Sản phẩm B\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Ô tô & Xe máy	http://localhost:8080/api/files/611589588_1339432284889468_7419054128254423384_n.jpg	APPROVED	Sản phẩm B	416000.00	0	467	\N	16	3	0	0	\N
78	0	🔥 Sản phẩm C\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Ô tô & Xe máy	http://localhost:8080/api/files/3e5f01f7-ec89-4893-9e3f-003517c0fbde.jpg	APPROVED	Sản phẩm C	593000.00	0	448	\N	16	2	0	0	\N
79	0	🔥 Hàng mới về\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Ô tô & Xe máy	http://localhost:8080/api/files/b2e5aeaa-6f98-43db-bfda-ceabdc5a33f8.jpg	APPROVED	Hàng mới về	234000.00	0	31	\N	16	2	0	0	\N
54	0	🔥 Hàng mới về\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Giày dép nữ	http://localhost:8080/api/files/7381b539-97a7-4b42-a3fb-ea39a926de82.jpg	APPROVED	Hàng mới về	459000.00	0	303	\N	11	1	0	0	\N
56	0	🔥 Sản phẩm A\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Túi ví nữ	http://localhost:8080/api/files/839e5019-e88c-40aa-ac5f-6e1ffc943155.jpg	APPROVED	Sản phẩm A	417000.00	0	213	\N	12	1	0	0	\N
58	0	🔥 Sản phẩm C\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Túi ví nữ	http://localhost:8080/api/files/79f8ea20-4119-4a74-a453-40d57f84df25.jpg	APPROVED	Sản phẩm C	629000.00	0	462	\N	12	1	0	0	\N
84	0	🔥 Hàng mới về\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Nhà sách online	http://localhost:8080/api/files/05a08737-6893-4821-9e9b-a20861d49b54.jpg	APPROVED	Hàng mới về	129000.00	0	502	\N	17	1	0	0	\N
87	0	🔥 Sản phẩm B\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thú cưng	http://localhost:8080/api/files/a14b4101-3eb5-4948-acf7-cf8ec4758311.jpg	APPROVED	Sản phẩm B	778000.00	0	483	\N	18	2	0	0	\N
26	0	🔥 Sản phẩm A\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Nhà cửa & Đời sống	http://localhost:8080/api/files/401689e8-e036-4238-aca8-654c212b3480.jpg	APPROVED	Sản phẩm A	861000.00	0	218	\N	6	1	0	0	\N
88	0	🔥 Sản phẩm C\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thú cưng	http://localhost:8080/api/files/b995b0e6-52a6-4136-b467-cae34ee7a962.jpg	APPROVED	Sản phẩm C	195000.00	0	458	\N	18	2	0	0	\N
89	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thú cưng	http://localhost:8080/api/files/79f8ea20-4119-4a74-a453-40d57f84df25.jpg	APPROVED	Hàng mới về	985000.00	0	127	\N	18	1	0	0	\N
34	0	🔥 Hàng mới về\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Sức khỏe & Làm đẹp	http://localhost:8080/api/files/c34bc910-e846-40b3-8aab-751091ab1c74.jpg	APPROVED	Hàng mới về	73000.00	0	284	\N	7	1	0	0	\N
1	0	🔥 Áo Thun Nam Cotton Cổ Tròn\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thời trang nam	http://localhost:8080/api/files/9afbd382-f28e-4152-b874-d6ebd2cf1cfc.jpg	APPROVED	Áo Thun Nam Cotton Cổ Tròn	333000.00	0	157	\N	1	1	0	0	\N
93	0	hiihho	http://localhost:8080/api/files/e0fa36c4-a4ed-4731-a265-9302d67220e7.jpg	APPROVED	hello world	25000.00	0	100	\N	8	6	0	0	\N
91	0	sdadsadas	http://localhost:8080/api/files/7381b539-97a7-4b42-a3fb-ea39a926de82.jpg	APPROVED	testflashsale	150000.00	0	100	\N	15	3	0	0	\N
17	0	🔥 Sản phẩm B\n\n✅ Hàng chính hãng 100%\n🚚 Freeship toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Máy tính & Laptop	http://localhost:8080/api/files/3c86c750-5673-434e-86be-61b4640b55eb.jpg	APPROVED	Sản phẩm B	403000.00	0	486	\N	4	1	0	0	\N
80	0	🔥 Sản phẩm khuyến mãi\n\n✅ Chất lượng cao\n🚚 Freeship toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Ô tô & Xe máy	http://localhost:8080/api/files/cf377b59-0260-48dd-a99b-a9b7e3d560aa.jpg	APPROVED	Sản phẩm khuyến mãi	468000.00	0	49	\N	16	4	0	0	\N
81	0	🔥 Sản phẩm A\n\n✅ Chất lượng cao\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Nhà sách online	http://localhost:8080/api/files/3e5f01f7-ec89-4893-9e3f-003517c0fbde.jpg	APPROVED	Sản phẩm A	75000.00	0	419	\N	17	1	0	0	\N
85	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Nhà sách online	http://localhost:8080/api/files/e64d5b18-76fa-420c-91f5-246efe1092ec.jpg	APPROVED	Sản phẩm khuyến mãi	611000.00	0	196	\N	17	1	0	0	\N
86	0	🔥 Sản phẩm A\n\n✅ Cam kết như mô tả\n🚚 Ship COD toàn quốc\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thú cưng	http://localhost:8080/api/files/3eae4d43-6b07-4bdf-a0f3-8246f2e72edf.jpg	APPROVED	Sản phẩm A	795000.00	0	55	\N	18	3	0	0	\N
92	0	đá	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	TestNotify	25000.00	0	100	\N	12	3	0	0	\N
83	0	🔥 Sản phẩm C\n\n✅ Cam kết như mô tả\n🚚 Freeship toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Nhà sách online	http://localhost:8080/api/files/e64d5b18-76fa-420c-91f5-246efe1092ec.jpg	APPROVED	Sản phẩm C	645000.00	0	326	\N	17	4	0	0	\N
55	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Giày dép nữ	http://localhost:8080/api/files/80691b41-f3ff-493a-829c-3417b19436c9.jpg	APPROVED	Sản phẩm khuyến mãi	621000.00	0	240	\N	11	1	0	0	\N
30	0	🔥 Sản phẩm khuyến mãi\n\n✅ Chất lượng cao\n🚚 Đóng gói cẩn thận\n💰 Sale giá sốc\n\n📌 Danh mục: Nhà cửa & Đời sống	http://localhost:8080/api/files/cf377b59-0260-48dd-a99b-a9b7e3d560aa.jpg	APPROVED	Sản phẩm khuyến mãi	504000.00	0	151	\N	6	3	0	0	\N
90	0	🔥 Sản phẩm khuyến mãi\n\n✅ Chất lượng cao\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thú cưng	http://localhost:8080/api/files/3e5f01f7-ec89-4893-9e3f-003517c0fbde.jpg	APPROVED	Sản phẩm khuyến mãi	433000.00	0	95	\N	18	1	0	0	\N
45	0	🔥 Sản phẩm khuyến mãi\n\n✅ Cam kết như mô tả\n🚚 Đóng gói cẩn thận\n💰 Mua 2 giảm 10%\n\n📌 Danh mục: Thể thao & Du lịch	http://localhost:8080/api/files/7a850735-27cf-4d52-9cd9-417b15bc8f48.jpg	APPROVED	Sản phẩm khuyến mãi	726000.00	0	208	\N	9	3	0	0	\N
60	0	🔥 Sản phẩm khuyến mãi\n\n✅ Cam kết như mô tả\n🚚 Giao hàng nhanh 2h\n💰 Tặng quà khi mua\n\n📌 Danh mục: Túi ví nữ	http://localhost:8080/api/files/f5664362-00c7-4f30-b65c-94b9874470f6.jpg	APPROVED	Sản phẩm khuyến mãi	673000.00	0	480	\N	12	3	0	0	\N
70	0	🔥 Sản phẩm khuyến mãi\n\n✅ Bảo hành 12 tháng\n🚚 Freeship toàn quốc\n💰 Tặng quà khi mua\n\n📌 Danh mục: Đồng hồ	http://localhost:8080/api/files/c1078351-095a-4fce-9975-1efa65f5f458.jpg	APPROVED	Sản phẩm khuyến mãi	207000.00	0	198	\N	14	4	0	0	\N
82	0	🔥 Sản phẩm B\n\n✅ Bảo hành 12 tháng\n🚚 Ship COD toàn quốc\n💰 Sale giá sốc\n\n📌 Danh mục: Nhà sách online	http://localhost:8080/api/files/b2e5aeaa-6f98-43db-bfda-ceabdc5a33f8.jpg	APPROVED	Sản phẩm B	916000.00	0	90	\N	17	2	0	0	\N
3	0	🔥 Áo Sơ Mi Nam Tay Dài Công Sở\n\n✅ Bảo hành 12 tháng\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Thời trang nam	http://localhost:8080/api/files/05a08737-6893-4821-9e9b-a20861d49b54.jpg	APPROVED	Áo Sơ Mi Nam Tay Dài Công Sở	675000.00	0	326	\N	1	2	0	0	\N
50	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Đóng gói cẩn thận\n💰 Tặng quà khi mua\n\n📌 Danh mục: Giày dép nam	http://localhost:8080/api/files/e0fa36c4-a4ed-4731-a265-9302d67220e7.jpg	APPROVED	Sản phẩm khuyến mãi	509000.00	0	420	\N	10	3	0	0	\N
65	0	🔥 Sản phẩm khuyến mãi\n\n✅ Hàng chính hãng 100%\n🚚 Ship COD toàn quốc\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Phụ kiện & Trang sức	http://localhost:8080/api/files/b995b0e6-52a6-4136-b467-cae34ee7a962.jpg	APPROVED	Sản phẩm khuyến mãi	245000.00	0	81	\N	13	3	0	0	\N
53	0	🔥 Sản phẩm C\n\n✅ Bảo hành 12 tháng\n🚚 Giao hàng nhanh 2h\n💰 Giá tốt nhất thị trường\n\n📌 Danh mục: Giày dép nữ	http://localhost:8080/api/files/a14b4101-3eb5-4948-acf7-cf8ec4758311.jpg	APPROVED	Sản phẩm C	916000.00	0	52	\N	11	3	0	0	\N
96	0	hehehe	http://localhost:8080/api/files/38583803-bc0e-4fde-8b93-f96070a7f517.jpg	APPROVED	hehehe1	250000.00	0	10	\N	1	8	0	0	\N
97	0	dhaohdsoha	http://localhost:8080/api/files/e49a5c50-6bd9-4301-9582-84ab5e699ac7.jpg	APPROVED	cửa hàng test1	290000.00	0	100	\N	1	9	0	0	\N
98	0	đạiaiodjiosa	http://localhost:8080/api/files/5b48edb5-6b47-46d7-b719-9f30378effa5.jpg	APPROVED	set1	22990.00	0	100	\N	1	3	0	0	\N
99	0	dạhoidhoahi	http://localhost:8080/api/files/0f6295da-0c78-4f19-8f84-a7188436a25c.png	APPROVED	test nhiều ảnh product	120000.00	0	80	\N	3	4	0	0	\N
\.


--
-- TOC entry 3560 (class 0 OID 29484)
-- Dependencies: 240
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_images (review_id, image_url) FROM stdin;
\.


--
-- TOC entry 3562 (class 0 OID 29488)
-- Dependencies: 242
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, comment, created_at, rating, order_id, product_id, user_id) FROM stdin;
1	\N	2026-02-17 11:22:13.188378	0	2	1	2
2	\N	2026-02-17 11:22:13.194876	0	2	1	1
3	\N	2026-02-17 11:22:13.197192	0	5	1	5
4	\N	2026-02-17 11:22:13.20071	0	5	2	5
5	\N	2026-02-17 11:22:13.201722	0	2	2	1
6	\N	2026-02-17 11:22:13.204717	0	5	2	7
7	\N	2026-02-17 11:22:13.207809	0	5	3	4
8	\N	2026-02-17 11:22:13.208819	0	1	3	8
9	\N	2026-02-17 11:22:13.21033	0	5	4	6
10	\N	2026-02-17 11:22:13.214051	0	4	4	11
11	\N	2026-02-17 11:22:13.21684	0	5	5	10
12	\N	2026-02-17 11:22:13.218349	0	4	5	2
13	\N	2026-02-17 11:22:13.220462	0	1	6	10
14	\N	2026-02-17 11:22:13.222402	0	1	7	7
16	\N	2026-02-17 11:22:13.226018	0	4	9	4
17	\N	2026-02-17 11:22:13.228486	0	1	10	1
18	\N	2026-02-17 11:22:13.22999	0	5	11	8
19	\N	2026-02-17 11:22:13.231006	0	3	12	9
20	\N	2026-02-17 11:22:13.234528	0	4	12	10
21	\N	2026-02-17 11:22:13.235914	0	3	12	7
22	\N	2026-02-17 11:22:13.238325	0	2	13	10
23	\N	2026-02-17 11:22:13.239848	0	3	14	5
24	\N	2026-02-17 11:22:13.244292	0	1	15	6
25	\N	2026-02-17 11:22:13.247304	0	4	16	9
26	\N	2026-02-17 11:22:13.2493	0	2	16	3
27	\N	2026-02-17 11:22:13.250306	0	2	17	1
28	\N	2026-02-17 11:22:13.252367	0	1	17	10
29	\N	2026-02-17 11:22:13.25453	0	4	18	6
30	\N	2026-02-17 11:22:13.256746	0	5	19	11
31	\N	2026-02-17 11:22:13.258216	0	1	19	4
32	\N	2026-02-17 11:22:13.260213	0	4	19	10
33	\N	2026-02-17 11:22:13.262041	0	4	20	9
34	\N	2026-02-17 11:22:13.263557	0	4	20	1
35	\N	2026-02-17 11:22:13.265683	0	2	20	4
36	\N	2026-02-17 11:22:13.267698	0	2	21	6
37	\N	2026-02-17 11:22:13.269738	0	2	21	2
38	\N	2026-02-17 11:22:13.271756	0	1	21	3
39	\N	2026-02-17 11:22:13.273829	0	1	22	9
40	\N	2026-02-17 11:22:13.276339	0	1	22	11
41	\N	2026-02-17 11:22:13.278111	0	5	23	7
42	\N	2026-02-17 11:22:13.279963	0	5	23	2
43	\N	2026-02-17 11:22:13.282485	0	5	23	6
44	\N	2026-02-17 11:22:13.283496	0	4	24	3
45	\N	2026-02-17 11:22:13.286013	0	4	24	10
46	\N	2026-02-17 11:22:13.288556	0	5	25	5
47	\N	2026-02-17 11:22:13.289553	0	3	26	6
48	\N	2026-02-17 11:22:13.291058	0	3	26	1
49	\N	2026-02-17 11:22:13.292574	0	1	27	1
50	\N	2026-02-17 11:22:13.295098	0	1	28	6
51	\N	2026-02-17 11:22:13.296104	0	4	28	6
52	\N	2026-02-17 11:22:13.298497	0	1	28	7
53	\N	2026-02-17 11:22:13.299496	0	3	29	7
54	\N	2026-02-17 11:22:13.300497	0	5	29	8
55	\N	2026-02-17 11:22:13.304479	0	4	30	5
56	\N	2026-02-17 11:22:13.305528	0	4	30	7
57	\N	2026-02-17 11:22:13.310112	0	4	31	5
58	\N	2026-02-17 11:22:13.31166	0	3	32	1
59	\N	2026-02-17 11:22:13.313219	0	2	33	3
60	\N	2026-02-17 11:22:13.314277	0	4	34	10
61	\N	2026-02-17 11:22:13.31675	0	3	35	2
62	\N	2026-02-17 11:22:13.318516	0	4	35	4
63	\N	2026-02-17 11:22:13.319527	0	5	36	2
64	\N	2026-02-17 11:22:13.321047	0	5	36	4
65	\N	2026-02-17 11:22:13.323713	0	3	37	8
66	\N	2026-02-17 11:22:13.324708	0	1	37	4
67	\N	2026-02-17 11:22:13.327227	0	5	38	4
68	\N	2026-02-17 11:22:13.328238	0	4	39	6
69	\N	2026-02-17 11:22:13.330797	0	2	39	10
70	\N	2026-02-17 11:22:13.331806	0	2	40	7
71	\N	2026-02-17 11:22:13.333345	0	1	40	4
72	\N	2026-02-17 11:22:13.334399	0	4	40	6
73	\N	2026-02-17 11:22:13.336354	0	2	41	10
74	\N	2026-02-17 11:22:13.338054	0	2	41	10
75	\N	2026-02-17 11:22:13.33905	0	3	42	2
76	\N	2026-02-17 11:22:13.341095	0	3	42	10
77	\N	2026-02-17 11:22:13.342444	0	3	42	1
78	\N	2026-02-17 11:22:13.343409	0	3	43	7
79	\N	2026-02-17 11:22:13.345778	0	1	44	11
80	\N	2026-02-17 11:22:13.346776	0	4	44	9
81	\N	2026-02-17 11:22:13.348775	0	3	45	11
82	\N	2026-02-17 11:22:13.349776	0	3	45	6
83	\N	2026-02-17 11:22:13.351817	0	3	45	8
84	\N	2026-02-17 11:22:13.354344	0	1	46	9
85	\N	2026-02-17 11:22:13.356135	0	1	47	4
86	\N	2026-02-17 11:22:13.359016	0	4	48	11
87	\N	2026-02-17 11:22:13.360536	0	4	48	1
88	\N	2026-02-17 11:22:13.362541	0	1	48	5
89	\N	2026-02-17 11:22:13.365073	0	3	49	1
90	\N	2026-02-17 11:22:13.366773	0	4	49	1
91	\N	2026-02-17 11:22:13.368856	0	1	50	2
92	\N	2026-02-17 11:22:13.370489	0	3	50	3
93	\N	2026-02-17 11:22:13.371515	0	1	51	5
94	\N	2026-02-17 11:22:13.374297	0	1	51	8
95	\N	2026-02-17 11:22:13.375306	0	1	52	8
96	\N	2026-02-17 11:22:13.377339	0	5	52	8
97	\N	2026-02-17 11:22:13.379524	0	4	53	6
98	\N	2026-02-17 11:22:13.381449	0	2	53	9
99	\N	2026-02-17 11:22:13.382486	0	2	53	2
100	\N	2026-02-17 11:22:13.385429	0	1	54	9
101	\N	2026-02-17 11:22:13.386771	0	5	54	1
102	\N	2026-02-17 11:22:13.388793	0	4	54	8
103	\N	2026-02-17 11:22:13.390161	0	1	55	1
104	\N	2026-02-17 11:22:13.391193	0	4	55	1
105	\N	2026-02-17 11:22:13.393335	0	5	56	3
106	\N	2026-02-17 11:22:13.395352	0	1	56	5
107	\N	2026-02-17 11:22:13.396397	0	4	56	5
108	\N	2026-02-17 11:22:13.398621	0	1	57	11
109	\N	2026-02-17 11:22:13.402133	0	1	58	7
110	\N	2026-02-17 11:22:13.403679	0	3	59	10
111	\N	2026-02-17 11:22:13.404691	0	5	60	5
112	\N	2026-02-17 11:22:13.40758	0	5	61	2
113	\N	2026-02-17 11:22:13.408591	0	2	62	5
114	\N	2026-02-17 11:22:13.410098	0	1	63	7
115	\N	2026-02-17 11:22:13.411759	0	4	64	2
116	\N	2026-02-17 11:22:13.413282	0	1	64	6
117	\N	2026-02-17 11:22:13.415299	0	2	65	2
118	\N	2026-02-17 11:22:13.416909	0	1	65	1
119	\N	2026-02-17 11:22:13.417226	0	4	65	11
120	\N	2026-02-17 11:22:13.419726	0	3	66	5
121	\N	2026-02-17 11:22:13.421318	0	4	66	2
122	\N	2026-02-17 11:22:13.422839	0	1	66	7
123	\N	2026-02-17 11:22:13.423357	0	3	67	6
124	\N	2026-02-17 11:22:13.424471	0	2	67	5
125	\N	2026-02-17 11:22:13.425478	0	4	68	3
126	\N	2026-02-17 11:22:13.427287	0	1	68	6
127	\N	2026-02-17 11:22:13.428515	0	2	69	9
128	\N	2026-02-17 11:22:13.430025	0	5	69	2
129	\N	2026-02-17 11:22:13.431038	0	2	69	3
130	\N	2026-02-17 11:22:13.432549	0	3	70	2
131	\N	2026-02-17 11:22:13.434559	0	3	70	8
132	\N	2026-02-17 11:22:13.436966	0	2	70	4
133	\N	2026-02-17 11:22:13.438311	0	2	71	5
134	\N	2026-02-17 11:22:13.439312	0	5	71	1
135	\N	2026-02-17 11:22:13.441832	0	5	71	5
136	\N	2026-02-17 11:22:13.443172	0	4	72	8
137	\N	2026-02-17 11:22:13.444679	0	5	72	1
138	\N	2026-02-17 11:22:13.446985	0	5	73	10
139	\N	2026-02-17 11:22:13.449297	0	2	73	9
140	\N	2026-02-17 11:22:13.450309	0	4	73	3
141	\N	2026-02-17 11:22:13.451819	0	4	74	10
142	\N	2026-02-17 11:22:13.452827	0	3	74	4
143	\N	2026-02-17 11:22:13.454335	0	2	74	8
144	\N	2026-02-17 11:22:13.457032	0	5	75	10
145	\N	2026-02-17 11:22:13.458811	0	1	76	7
146	\N	2026-02-17 11:22:13.460321	0	5	76	10
147	\N	2026-02-17 11:22:13.461334	0	3	76	1
148	\N	2026-02-17 11:22:13.463164	0	5	77	8
149	\N	2026-02-17 11:22:13.465289	0	2	77	8
150	\N	2026-02-17 11:22:13.466235	0	1	78	7
151	\N	2026-02-17 11:22:13.466806	0	1	79	2
152	\N	2026-02-17 11:22:13.469568	0	2	80	7
153	\N	2026-02-17 11:22:13.470582	0	2	81	4
154	\N	2026-02-17 11:22:13.472608	0	2	81	6
155	\N	2026-02-17 11:22:13.474621	0	4	81	4
156	\N	2026-02-17 11:22:13.47697	0	5	82	8
157	\N	2026-02-17 11:22:13.478147	0	3	83	2
158	\N	2026-02-17 11:22:13.480172	0	2	84	1
159	\N	2026-02-17 11:22:13.481692	0	1	84	1
160	\N	2026-02-17 11:22:13.483838	0	1	84	9
161	\N	2026-02-17 11:22:13.485111	0	2	85	3
162	\N	2026-02-17 11:22:13.487016	0	2	85	11
163	\N	2026-02-17 11:22:13.488032	0	3	86	8
164	\N	2026-02-17 11:22:13.490588	0	1	86	1
165	\N	2026-02-17 11:22:13.491199	0	3	87	9
166	\N	2026-02-17 11:22:13.493213	0	3	87	10
167	\N	2026-02-17 11:22:13.494723	0	1	87	2
168	\N	2026-02-17 11:22:13.495814	0	1	88	8
169	\N	2026-02-17 11:22:13.497674	0	5	88	6
170	\N	2026-02-17 11:22:13.499195	0	1	89	4
171	\N	2026-02-17 11:22:13.500262	0	2	89	4
172	\N	2026-02-17 11:22:13.502878	0	2	90	11
173	\N	2026-02-17 11:22:13.504657	0	5	90	1
174		2026-02-18 23:30:47.308878	5	5	15	7
\.


--
-- TOC entry 3564 (class 0 OID 29495)
-- Dependencies: 244
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (id, description, name, owner_id) FROM stdin;
1	Chuyên cung cấp sản phẩm chất lượng cao, uy tín hàng đầu.	Gian hàng Điện tử Quốc Tế	3
2	Chuyên cung cấp sản phẩm chất lượng cao, uy tín hàng đầu.	Nhà cung cấp Sách Hồng Phúc	4
3	Chuyên cung cấp sản phẩm chất lượng cao, uy tín hàng đầu.	Shop Phụ kiện Thành Đạt	5
5	Chào mừng đến với cửa hàng của duongminhbinh7918!	duongminhbinh7918's Shop	11
6	Chào mừng đến với cửa hàng của duongthanhmai823!	duongthanhmai823's Shop	8
7	Chào mừng đến với cửa hàng của testregister!	testregister's Shop	12
8	Thiên đường mua sắm	Antonio	14
4	Chuyên cung cấp sản phẩm chất lượng cao, uy tín hàng đầu.	Hồng Phúc's Store	2
9	Chào mừng đến với cửa hàng của usershop1!	Cửa hàng test	16
\.


--
-- TOC entry 3577 (class 0 OID 29790)
-- Dependencies: 257
-- Data for Name: sliders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sliders (id, created_at, display_order, image_url, is_active, link, title, updated_at) FROM stdin;
7	2026-02-23 23:44:52.229865	3	e1933e5e-efea-4c2a-a31e-23d88772e599.jpg	t	http://localhost:3000/admin/sliders	hehe	2026-02-24 18:27:57.952924
8	2026-02-24 12:52:57.768874	1	d48ef1a5-d639-47ee-8497-bdb55ecb9cb8.jpg	t	http://localhost:3000/admin/sliders		2026-02-24 18:28:02.728282
6	2026-02-23 23:28:34.760204	2	df128dfa-6052-441a-ac19-68fbb424c3fb.jpg	t	http://localhost:3000/admin/sliders	Siêu sale	2026-02-24 18:28:02.72727
\.


--
-- TOC entry 3566 (class 0 OID 29504)
-- Dependencies: 246
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, email, is_locked, password, role, seller_status, username) FROM stdin;
1	2026-02-17 11:22:12.111734	admin@gmail.com	f	$2a$10$fvnHGIVuZ05CvSQt4oaBfeiuS132H.S2P/Y6fg9RtaULlE6/Oub1.	ADMIN	\N	admin
3	2026-02-17 11:22:12.174021	seller2@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	seller2
4	2026-02-17 11:22:12.178488	seller3@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	seller3
6	2026-02-17 11:22:12.188613	phantuanan9827@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	USER	\N	phantuanan9827
7	2026-02-17 11:22:12.191511	duongthian6915@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	USER	\N	duongthian6915
9	2026-02-17 11:22:12.199214	phanvanphuong2149@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	USER	\N	phanvanphuong2149
5	2026-02-17 11:22:12.182496	seller4@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	seller4
11	2026-02-17 11:22:12.20427	duongminhbinh7918@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	duongminhbinh7918
8	2026-02-17 11:22:12.196352	duongthanhmai823@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	duongthanhmai823
2	2026-02-17 11:22:12.170765	seller1@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	SELLER	APPROVED	seller1
12	2026-02-19 21:08:53.803415	testregister@gmail.com	f	$2a$10$JCbiSknhH7MuyrhmP4FUwOhZFM8UnbsQ6fn2BzIU2Dc20hpZoInbS	SELLER	APPROVED	testregister
10	2026-02-17 11:22:12.201745	phanhuuhung1103@gmail.com	f	$2a$10$gHQMiOK/FHdBPl8z.5SROOk/VXUQV8esERf3iE63s/eQPm4iLUubW	USER	\N	phanhuuhung1103
13	2026-02-24 20:24:48.175321	sellertestname@gmail.com	f	$2a$10$Jnbmv5Zgzh3LHKpR7Y3mx.ZjYZyrh2rI/ARsC3YcFWvUMaT3Jc0MG	USER	\N	sellertestname
14	2026-02-24 20:35:49.520083	seller6@gmail.com	f	$2a$10$jeBjwlURHdzovwOuBURlNe7MyyWAqrG9PxmMA6IUhSwcUHyQ8uZEC	SELLER	APPROVED	seller6
15	2026-02-25 09:36:58.12399	usertestshop@gmail.com	f	$2a$10$zrnPd3FfYyhm8HZAtdeqh.pXQTHkzJBvHslvoD8e91V7Tk1FkrNeu	USER	\N	usertestshop
16	2026-02-25 09:37:59.851316	usershop1@gmail.com	f	$2a$10$wFVJ8G2KGM8hiaYiU4kKdugR2u.zUm1rwkNBXLm18MjqJXoA0xYti	SELLER	APPROVED	usershop1
\.


--
-- TOC entry 3568 (class 0 OID 29515)
-- Dependencies: 248
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vouchers (id, code, discount_type, discount_value, end_date, min_order_value, start_date, usage_limit, shop_id) FROM stdin;
1	SALE8999	PERCENTAGE	10.00	2026-03-19 11:22:12.661708	175738.00	2026-02-17 11:22:12.661708	83	\N
2	FREESHIP5214	PERCENTAGE	24.00	2026-03-19 11:22:12.661708	152605.00	2026-02-17 11:22:12.661708	90	\N
3	HOTSALE8633	FIXED	57223.00	2026-03-19 11:22:12.661708	86190.00	2026-02-17 11:22:12.661708	67	\N
4	FREESHIP1719	PERCENTAGE	43.00	2026-03-19 11:22:12.661708	269762.00	2026-02-17 11:22:12.661708	27	\N
5	HOTSALE6407	FIXED	48442.00	2026-03-19 11:22:12.663741	166107.00	2026-02-17 11:22:12.663741	93	\N
6	GIAM10%	PERCENTAGE	10.00	2026-02-17 21:07:00	20000.00	2026-02-17 20:07:00	\N	3
7	A6H0XKBI5C9VKLY	PERCENTAGE	10.00	2026-02-24 20:28:00	10000.00	2026-02-24 18:28:00	\N	4
8	HOHO	PERCENTAGE	10.00	2026-02-24 18:30:00	10000.00	2026-02-24 18:30:15	100	\N
\.


--
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 214
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, true);


--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 254
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.banners_id_seq', 1, false);


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 216
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 2, true);


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 218
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 11, true);


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 18, true);


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 250
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 3, true);


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 222
-- Name: flash_sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flash_sale_items_id_seq', 140, true);


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 224
-- Name: flash_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flash_sales_id_seq', 7, true);


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 252
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 3, true);


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 226
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 23, true);


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 228
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 19, true);


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 230
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 7, true);


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 232
-- Name: product_attribute_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_attribute_options_id_seq', 12, true);


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 234
-- Name: product_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_attributes_id_seq', 4, true);


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 17, true);


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 238
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 99, true);


--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 241
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 174, true);


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 243
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shops_id_seq', 9, true);


--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 256
-- Name: sliders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sliders_id_seq', 8, true);


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 245
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 247
-- Name: vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vouchers_id_seq', 8, true);


--
-- TOC entry 3313 (class 2606 OID 29382)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3361 (class 2606 OID 29788)
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 29389)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 29396)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 3321 (class 2606 OID 29405)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 29750)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 2606 OID 29412)
-- Name: flash_sale_items flash_sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3325 (class 2606 OID 29419)
-- Name: flash_sales flash_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT flash_sales_pkey PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 29759)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3327 (class 2606 OID 29429)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3329 (class 2606 OID 29436)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3331 (class 2606 OID 29447)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3333 (class 2606 OID 29456)
-- Name: product_attribute_options product_attribute_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options
    ADD CONSTRAINT product_attribute_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 29463)
-- Name: product_attributes product_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (id);


--
-- TOC entry 3337 (class 2606 OID 29472)
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 3339 (class 2606 OID 29483)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 29493)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3343 (class 2606 OID 29502)
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- TOC entry 3363 (class 2606 OID 29797)
-- Name: sliders sliders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders
    ADD CONSTRAINT sliders_pkey PRIMARY KEY (id);


--
-- TOC entry 3353 (class 2606 OID 29533)
-- Name: vouchers uk_30ftp2biebbvpik8e49wlmady; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT uk_30ftp2biebbvpik8e49wlmady UNIQUE (code);


--
-- TOC entry 3319 (class 2606 OID 29525)
-- Name: carts uk_64t7ox312pqal3p7fg9o503c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT uk_64t7ox312pqal3p7fg9o503c2 UNIQUE (user_id);


--
-- TOC entry 3347 (class 2606 OID 29529)
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- TOC entry 3345 (class 2606 OID 29527)
-- Name: shops uk_6x3im56qg96va2stnwgkk7vtm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT uk_6x3im56qg96va2stnwgkk7vtm UNIQUE (owner_id);


--
-- TOC entry 3349 (class 2606 OID 29531)
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- TOC entry 3351 (class 2606 OID 29513)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3355 (class 2606 OID 29523)
-- Name: vouchers vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_pkey PRIMARY KEY (id);


--
-- TOC entry 3364 (class 2606 OID 29534)
-- Name: addresses fk1fa36y2oqhao3wgg2rw1pi459; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk1fa36y2oqhao3wgg2rw1pi459 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3365 (class 2606 OID 29544)
-- Name: cart_items fk1re40cjegsfvw58xrkdp6bac6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk1re40cjegsfvw58xrkdp6bac6 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3373 (class 2606 OID 29584)
-- Name: orders fk32ql8ubntj5uh44ph9659tiih; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3381 (class 2606 OID 29619)
-- Name: review_images fk3aayo5bjciyemf3bvvt987hkr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT fk3aayo5bjciyemf3bvvt987hkr FOREIGN KEY (review_id) REFERENCES public.reviews(id);


--
-- TOC entry 3390 (class 2606 OID 29775)
-- Name: messages fk4ui4nnwntodh6wjvck53dbk9m; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk4ui4nnwntodh6wjvck53dbk9m FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 3368 (class 2606 OID 29559)
-- Name: flash_sale_items fk5p9e16gsvvhlc28cjyvju7m99; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fk5p9e16gsvvhlc28cjyvju7m99 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3379 (class 2606 OID 29614)
-- Name: products fk7kp8sbhxboponhx3lxqtmkcoj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk7kp8sbhxboponhx3lxqtmkcoj FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- TOC entry 3388 (class 2606 OID 29760)
-- Name: conversations fk8wv0rmd8jb3cqcbyng15ubrmk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk8wv0rmd8jb3cqcbyng15ubrmk FOREIGN KEY (user1_id) REFERENCES public.users(id);


--
-- TOC entry 3370 (class 2606 OID 29564)
-- Name: notifications fk9y21adhxn0ayjhfocscqox7bh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk9y21adhxn0ayjhfocscqox7bh FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3367 (class 2606 OID 29549)
-- Name: carts fkb5o626f86h46m4s7ms6ginnop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fkb5o626f86h46m4s7ms6ginnop FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3371 (class 2606 OID 29569)
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3377 (class 2606 OID 29599)
-- Name: product_attributes fkcex46yvx4g18b2pn09p79h1mc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT fkcex46yvx4g18b2pn09p79h1mc FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3382 (class 2606 OID 29634)
-- Name: reviews fkcgy7qjc1r99dp117y9en6lxye; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkcgy7qjc1r99dp117y9en6lxye FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3374 (class 2606 OID 29589)
-- Name: orders fkdimvsocblb17f45ikjr6xn1wj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkdimvsocblb17f45ikjr6xn1wj FOREIGN KEY (voucher_id) REFERENCES public.vouchers(id);


--
-- TOC entry 3389 (class 2606 OID 29765)
-- Name: conversations fke7w0k1xem21pp85wxh5moodnk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fke7w0k1xem21pp85wxh5moodnk FOREIGN KEY (user2_id) REFERENCES public.users(id);


--
-- TOC entry 3386 (class 2606 OID 29644)
-- Name: vouchers fkfp0uiuo0q1alv0h9arfn9vafn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT fkfp0uiuo0q1alv0h9arfn9vafn FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- TOC entry 3375 (class 2606 OID 29579)
-- Name: orders fkmk6q95x8ffidq82wlqjaq7sqc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkmk6q95x8ffidq82wlqjaq7sqc FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id);


--
-- TOC entry 3369 (class 2606 OID 29554)
-- Name: flash_sale_items fkmr5agn0eu29xqqog30yspa3e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fkmr5agn0eu29xqqog30yspa3e3 FOREIGN KEY (flash_sale_id) REFERENCES public.flash_sales(id);


--
-- TOC entry 3376 (class 2606 OID 29594)
-- Name: product_attribute_options fknh6mqpegmo0urhlbg9ul0w2cm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options
    ADD CONSTRAINT fknh6mqpegmo0urhlbg9ul0w2cm FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id);


--
-- TOC entry 3372 (class 2606 OID 29574)
-- Name: order_items fkocimc7dtr037rh4ls4l95nlfi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkocimc7dtr037rh4ls4l95nlfi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3380 (class 2606 OID 29609)
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3378 (class 2606 OID 29604)
-- Name: product_variants fkosqitn4s405cynmhb87lkvuau; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkosqitn4s405cynmhb87lkvuau FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3366 (class 2606 OID 29539)
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 3383 (class 2606 OID 29629)
-- Name: reviews fkpl51cejpw4gy5swfar8br9ngi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkpl51cejpw4gy5swfar8br9ngi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3387 (class 2606 OID 29653)
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3384 (class 2606 OID 29624)
-- Name: reviews fkqwgq1lxgahsxdspnwqfac6sv6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkqwgq1lxgahsxdspnwqfac6sv6 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3385 (class 2606 OID 29639)
-- Name: shops fkrduswa89ayj0poad3l70nag19; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT fkrduswa89ayj0poad3l70nag19 FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 3391 (class 2606 OID 29770)
-- Name: messages fkt492th6wsovh1nush5yl5jj8e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fkt492th6wsovh1nush5yl5jj8e FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


-- Completed on 2026-02-25 15:22:05

--
-- PostgreSQL database dump complete
--

\unrestrict S5ExmLuWmWH7IwO84lFyRTlykXQq6opkmftcfhFO0AMVbc0qL9IXG5B5CQI77UK

