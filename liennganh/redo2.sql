--
-- PostgreSQL database dump
--

\restrict ogEeN0VndgoHXxNVkwP5VUbVHLNIyuSlamKIvlBzOtAAjCRBcREf2nyGbN2qbeL

-- Dumped from database version 15.15
-- Dumped by pg_dump version 15.15

-- Started on 2026-03-03 23:14:59

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
-- TOC entry 215 (class 1259 OID 29880)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id bigint NOT NULL,
    city character varying(255),
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
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
-- TOC entry 214 (class 1259 OID 29879)
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
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 214
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- TOC entry 217 (class 1259 OID 29890)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    quantity integer NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 29889)
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
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 216
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 219 (class 1259 OID 29898)
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    total_price numeric(38,2),
    user_id bigint NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 29897)
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
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 218
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- TOC entry 221 (class 1259 OID 29906)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    description text,
    image_url character varying(255),
    name character varying(255) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 29905)
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
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 223 (class 1259 OID 29916)
-- Name: conversations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conversations (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user1_id bigint NOT NULL,
    user2_id bigint NOT NULL
);


ALTER TABLE public.conversations OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 29915)
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
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 222
-- Name: conversations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conversations_id_seq OWNED BY public.conversations.id;


--
-- TOC entry 225 (class 1259 OID 29924)
-- Name: flash_sale_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flash_sale_items (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    discounted_price numeric(38,2),
    sold_quantity integer NOT NULL,
    stock_quantity integer NOT NULL,
    flash_sale_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.flash_sale_items OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 29923)
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
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 224
-- Name: flash_sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flash_sale_items_id_seq OWNED BY public.flash_sale_items.id;


--
-- TOC entry 227 (class 1259 OID 29932)
-- Name: flash_sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flash_sales (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    end_time timestamp(6) without time zone,
    is_active boolean,
    name character varying(255),
    start_time timestamp(6) without time zone
);


ALTER TABLE public.flash_sales OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 29931)
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
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 226
-- Name: flash_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.flash_sales_id_seq OWNED BY public.flash_sales.id;


--
-- TOC entry 229 (class 1259 OID 29940)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id bigint NOT NULL,
    content text,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    is_read boolean,
    conversation_id bigint NOT NULL,
    sender_id bigint NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 29939)
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
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 228
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- TOC entry 231 (class 1259 OID 29950)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
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
-- TOC entry 230 (class 1259 OID 29949)
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
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 233 (class 1259 OID 29961)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    price numeric(38,2) NOT NULL,
    quantity integer NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 29960)
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
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 232
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 235 (class 1259 OID 29969)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
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
-- TOC entry 234 (class 1259 OID 29968)
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
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 234
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 237 (class 1259 OID 29981)
-- Name: product_attribute_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_attribute_options (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    image_url character varying(255),
    value character varying(255) NOT NULL,
    attribute_id bigint NOT NULL
);


ALTER TABLE public.product_attribute_options OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 29980)
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
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_attribute_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_attribute_options_id_seq OWNED BY public.product_attribute_options.id;


--
-- TOC entry 239 (class 1259 OID 29991)
-- Name: product_attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_attributes (
    id bigint NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    name character varying(255) NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_attributes OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 29990)
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
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 238
-- Name: product_attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_attributes_id_seq OWNED BY public.product_attributes.id;


--
-- TOC entry 240 (class 1259 OID 29998)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    product_id bigint NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 30002)
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id bigint NOT NULL,
    attributes text,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    image_url character varying(255),
    price numeric(38,2) NOT NULL,
    stock_quantity integer NOT NULL,
    product_id bigint NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 30001)
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
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- TOC entry 244 (class 1259 OID 30012)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    average_rating double precision DEFAULT 0.0,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    description text,
    discount_percentage integer DEFAULT 0,
    discounted_price numeric(38,2),
    image_url character varying(255),
    name character varying(255) NOT NULL,
    price numeric(38,2) NOT NULL,
    product_status character varying(20) DEFAULT 'PENDING'::character varying,
    review_count bigint DEFAULT 0,
    sold bigint DEFAULT 0,
    stock_quantity integer NOT NULL,
    violation_reason character varying(255),
    category_id bigint NOT NULL,
    shop_id bigint NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 30011)
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
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 243
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 245 (class 1259 OID 30026)
-- Name: review_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_images (
    review_id bigint NOT NULL,
    image_url character varying(255)
);


ALTER TABLE public.review_images OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 30030)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    comment character varying(255),
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    rating integer NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 30029)
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
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 246
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 249 (class 1259 OID 30038)
-- Name: shops; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shops (
    id bigint NOT NULL,
    avatar_url character varying(255),
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    description character varying(255),
    name character varying(255) NOT NULL,
    owner_id bigint NOT NULL
);


ALTER TABLE public.shops OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 30037)
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
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 248
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shops_id_seq OWNED BY public.shops.id;


--
-- TOC entry 251 (class 1259 OID 30048)
-- Name: sliders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sliders (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
    display_order integer NOT NULL,
    image_url character varying(1000) NOT NULL,
    is_active boolean NOT NULL,
    link character varying(1000),
    title character varying(255),
    updated_at timestamp(6) without time zone
);


ALTER TABLE public.sliders OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 30047)
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
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 250
-- Name: sliders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sliders_id_seq OWNED BY public.sliders.id;


--
-- TOC entry 253 (class 1259 OID 30058)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp(6) without time zone,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
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
-- TOC entry 252 (class 1259 OID 30057)
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
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 252
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 255 (class 1259 OID 30070)
-- Name: vouchers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vouchers (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    deleted boolean DEFAULT false,
    deleted_at timestamp(6) without time zone,
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
-- TOC entry 254 (class 1259 OID 30069)
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
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 254
-- Name: vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vouchers_id_seq OWNED BY public.vouchers.id;


--
-- TOC entry 3276 (class 2604 OID 29883)
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- TOC entry 3278 (class 2604 OID 29893)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 3280 (class 2604 OID 29901)
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- TOC entry 3282 (class 2604 OID 29909)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3284 (class 2604 OID 29919)
-- Name: conversations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations ALTER COLUMN id SET DEFAULT nextval('public.conversations_id_seq'::regclass);


--
-- TOC entry 3286 (class 2604 OID 29927)
-- Name: flash_sale_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items ALTER COLUMN id SET DEFAULT nextval('public.flash_sale_items_id_seq'::regclass);


--
-- TOC entry 3288 (class 2604 OID 29935)
-- Name: flash_sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sales ALTER COLUMN id SET DEFAULT nextval('public.flash_sales_id_seq'::regclass);


--
-- TOC entry 3290 (class 2604 OID 29943)
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 29953)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3294 (class 2604 OID 29964)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 3296 (class 2604 OID 29972)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3298 (class 2604 OID 29984)
-- Name: product_attribute_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options ALTER COLUMN id SET DEFAULT nextval('public.product_attribute_options_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 29994)
-- Name: product_attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes ALTER COLUMN id SET DEFAULT nextval('public.product_attributes_id_seq'::regclass);


--
-- TOC entry 3302 (class 2604 OID 30005)
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- TOC entry 3304 (class 2604 OID 30015)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 30033)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 3313 (class 2604 OID 30041)
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops ALTER COLUMN id SET DEFAULT nextval('public.shops_id_seq'::regclass);


--
-- TOC entry 3315 (class 2604 OID 30051)
-- Name: sliders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders ALTER COLUMN id SET DEFAULT nextval('public.sliders_id_seq'::regclass);


--
-- TOC entry 3317 (class 2604 OID 30061)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3319 (class 2604 OID 30073)
-- Name: vouchers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers ALTER COLUMN id SET DEFAULT nextval('public.vouchers_id_seq'::regclass);


--
-- TOC entry 3548 (class 0 OID 29880)
-- Dependencies: 215
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, city, deleted, deleted_at, district, is_default, phone_number, recipient_name, street, ward, user_id) FROM stdin;
1	Thành phố Hà Nội	f	\N	Quận Hà Đông	f	112233445566	Dương Văn An	số 6	Phường Yên Nghĩa	5
\.


--
-- TOC entry 3550 (class 0 OID 29890)
-- Dependencies: 217
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, deleted, deleted_at, quantity, cart_id, product_id) FROM stdin;
\.


--
-- TOC entry 3552 (class 0 OID 29898)
-- Dependencies: 219
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, deleted, deleted_at, total_price, user_id) FROM stdin;
1	f	\N	0.00	1
2	f	\N	0.00	2
3	f	\N	0.00	3
4	f	\N	0.00	4
5	f	\N	0.00	5
\.


--
-- TOC entry 3554 (class 0 OID 29906)
-- Dependencies: 221
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, deleted, deleted_at, description, image_url, name) FROM stdin;
1	f	\N		\N	Thời Trang Nam
2	f	\N		\N	Thời Trang Nữ
3	f	\N		\N	Điện Thoại & Phụ Kiện
4	f	\N		\N	Mẹ & Bé
5	f	\N		\N	Thiết Bị Điện Tử
6	f	\N		\N	Nhà Cửa & Đời Sống
7	f	\N		\N	Máy Tính & Laptop
8	f	\N		\N	Sắc Đẹp
9	f	\N		\N	Máy Ảnh & Máy Quay Phim
10	f	\N		\N	Sức Khoẻ
11	f	\N		\N	Đồng Hồ
12	f	\N		\N	Giày Dép Nữ
13	f	\N		\N	Giày Dép Nam
14	f	\N		\N	Túi Ví Nữ
15	f	\N		\N	Thiết Bị Điện Gia Dụng 
16	f	\N		\N	Phụ Kiện & Trang Sức Nữ
17	f	\N		\N	Thể Thao & Du Lịch
18	f	\N		\N	Bách Hoá Online 
19	f	\N		\N	Ô Tô & Xe Máy & Xe Đạp
20	f	\N		\N	Nhà Sách Online
21	f	\N		\N	Balo & Túi Ví Nam
22	f	\N		\N	Thời Trang Trẻ Em
23	f	\N		\N	Đồ Chơi
24	f	\N		\N	Giặt Giũ & Chăm Sóc Nhà Cửa
25	f	\N		\N	Chăm Sóc Thú Cưng
26	f	\N		\N	Voucher & Dịch Vụ
27	f	\N		\N	Dụng cụ và Thiết Bị TIện Ích
\.


--
-- TOC entry 3556 (class 0 OID 29916)
-- Dependencies: 223
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conversations (id, created_at, deleted, deleted_at, updated_at, user1_id, user2_id) FROM stdin;
\.


--
-- TOC entry 3558 (class 0 OID 29924)
-- Dependencies: 225
-- Data for Name: flash_sale_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flash_sale_items (id, deleted, deleted_at, discounted_price, sold_quantity, stock_quantity, flash_sale_id, product_id) FROM stdin;
1	f	\N	720000.00	0	10	1	1
2	f	\N	90000.00	0	10	1	5
3	f	\N	5144400.00	0	10	1	9
4	f	\N	90000.00	0	10	1	4
5	f	\N	156600.00	0	10	1	8
6	f	\N	72000.00	0	10	1	7
7	f	\N	32391000.00	0	10	1	11
8	f	\N	5327100.00	0	10	1	10
9	f	\N	80.19	0	10	1	2
10	f	\N	26010.00	0	10	1	3
11	f	\N	242190.00	0	10	1	6
\.


--
-- TOC entry 3560 (class 0 OID 29932)
-- Dependencies: 227
-- Data for Name: flash_sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flash_sales (id, deleted, deleted_at, end_time, is_active, name, start_time) FROM stdin;
1	f	\N	2026-03-04 00:00:00	t	Flash Sale 3/3/2026	2026-03-03 23:00:00
\.


--
-- TOC entry 3562 (class 0 OID 29940)
-- Dependencies: 229
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, content, created_at, deleted, deleted_at, is_read, conversation_id, sender_id) FROM stdin;
\.


--
-- TOC entry 3564 (class 0 OID 29950)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, created_at, deleted, deleted_at, is_read, message, reference_id, title, type, user_id) FROM stdin;
1	2026-03-03 22:29:26.298883	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	1	Sản phẩm đã được duyệt: Áo sát nách Sleeveless tanktop thể thao Active Essentials thấm hút Coolmate	SYSTEM	2
2	2026-03-03 22:39:08.840563	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	5	Sản phẩm đã được duyệt: Mũ lưỡi trai chạy bộ unisex chơi thể thao, hoạt động ngoài ngời thoáng mát Coolmate	SYSTEM	2
3	2026-03-03 22:39:12.338983	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	4	Sản phẩm đã được duyệt: Áo Thun Gym thể thao Essentials II co giãn 4 chiều thấm hút Coolmate	SYSTEM	2
4	2026-03-03 22:39:13.40487	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	3	Sản phẩm đã được duyệt: Áo Polo nam SCafé nam tính khử mùi hiệu quả Coolmate	SYSTEM	2
5	2026-03-03 22:39:14.615406	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	2	Sản phẩm đã được duyệt: Áo Ba Lỗ Nam Mặc Trong Thoáng Khí, Excool Coolmate	SYSTEM	2
6	2026-03-03 22:45:45.905328	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	8	Sản phẩm đã được duyệt: Áo thun thể thao YODY Sport dệt jacquard thoáng khí MATS25S021	SYSTEM	3
7	2026-03-03 22:45:47.214821	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	7	Sản phẩm đã được duyệt: Áo Polo Nam YODY– Vải Cotton Mắt Chim Co Giãn – Thoáng Mát, Chống Nhăn – Áo Thun Có Cổ Nam APM7459	SYSTEM	3
8	2026-03-03 22:45:48.325295	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	6	Sản phẩm đã được duyệt: Áo Polo Nam Yody Vải Siêu Co Giãn Bo Cổ Dệt Thoải Mái Hạn Chế Bám Mồ Hôi MCPO25S037	SYSTEM	3
9	2026-03-03 22:58:34.225095	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	11	Sản phẩm đã được duyệt: Điện thoại Samsung Galaxy S26+, 12GB/512GB, Customized AP, AI Phone, Photo Assist, Creative Studio, 50MP Camera, 4900mAh	SYSTEM	4
10	2026-03-03 22:58:35.367587	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	10	Sản phẩm đã được duyệt: Điện Thoại Samsung Galaxy A17 5G 8GB/128GB	SYSTEM	4
11	2026-03-03 22:58:36.628054	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	9	Sản phẩm đã được duyệt: Điện Thoại Samsung Galaxy A26 5G 8GB/128GB	SYSTEM	4
12	2026-03-03 23:09:46.993055	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	14	Sản phẩm đã được duyệt: [Mã ELBSJBP03 giảm 12% đơn 500K] Máy ép chậm trái cây Elmich JEE 1855OL	SYSTEM	5
13	2026-03-03 23:09:48.425112	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	13	Sản phẩm đã được duyệt: Chảo chống dính siêu bền elmich EL-4711OL size 20,24,26,28cm	SYSTEM	5
14	2026-03-03 23:09:51.67622	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	12	Sản phẩm đã được duyệt: Bình giữ nhiệt inox 316 Elmich EL8315 dung tích 480ml	SYSTEM	5
15	2026-03-03 23:10:03.294499	f	\N	f	Sản phẩm bị khóa. Lý do: Vi phạm tiêu chuẩn cộng đồng	12	Sản phẩm bị khóa: Bình giữ nhiệt inox 316 Elmich EL8315 dung tích 480ml	PRODUCT_BAN	5
16	2026-03-03 23:10:57.287624	f	\N	f	Sản phẩm của bạn đã được duyệt và hiển thị cho người mua.	12	Sản phẩm đã được duyệt: Bình giữ nhiệt inox 316 Elmich EL8315 dung tích 480ml	SYSTEM	5
\.


--
-- TOC entry 3566 (class 0 OID 29961)
-- Dependencies: 233
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, deleted, deleted_at, price, quantity, order_id, product_id) FROM stdin;
1	f	\N	100000.00	1	1	5
\.


--
-- TOC entry 3568 (class 0 OID 29969)
-- Dependencies: 235
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, created_at, deleted, deleted_at, final_price, payment_method, status, total_price, shipping_address_id, user_id, voucher_id) FROM stdin;
1	2026-03-03 23:01:58.540736	f	\N	100000.00	VNPAY	DELIVERED	100000.00	1	5	\N
\.


--
-- TOC entry 3570 (class 0 OID 29981)
-- Dependencies: 237
-- Data for Name: product_attribute_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_attribute_options (id, deleted, deleted_at, image_url, value, attribute_id) FROM stdin;
1	f	\N	\N	Xanh	1
2	f	\N	\N	Đen 	1
3	f	\N	\N	Đỏ 	1
4	f	\N	\N	Đen	2
5	f	\N	\N	Xanh	2
6	f	\N	\N	Đỏ	2
7	f	\N	\N	M	3
8	f	\N	\N	L	3
9	f	\N	\N	XL	3
10	f	\N	\N	2XL	3
11	f	\N	\N	Xanh 	4
12	f	\N	\N	Đỏ	4
13	f	\N	\N	Xanh	5
14	f	\N	\N	Đỏ	5
15	f	\N	\N	Vàng	5
16	f	\N	\N	Đen	6
17	f	\N	\N	Xám	6
18	f	\N	\N	Xanh	7
19	f	\N	\N	Đen	7
20	f	\N	\N	Xanh 	8
21	f	\N	\N	Hồng	8
22	f	\N	\N	37	9
23	f	\N	\N	38	9
24	f	\N	\N	39	9
25	f	\N	\N	Black	10
26	f	\N	\N	Mint	10
27	f	\N	\N	Peach Pink	10
28	f	\N	\N	Đen 	11
29	f	\N	\N	Xanh	11
30	f	\N	\N	Xanh	12
31	f	\N	\N	Đỏ	12
32	f	\N	\N	Đen	13
33	f	\N	\N	Be 1	13
34	f	\N	\N	Be 2	13
35	f	\N	\N	23	14
36	f	\N	\N	24	14
37	f	\N	\N	25	14
\.


--
-- TOC entry 3572 (class 0 OID 29991)
-- Dependencies: 239
-- Data for Name: product_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_attributes (id, deleted, deleted_at, name, product_id) FROM stdin;
1	f	\N	Màu	1
2	f	\N	Màu	2
3	f	\N	Size 	2
4	f	\N	Màu	3
5	f	\N	Màu	4
6	f	\N	Màu	5
7	f	\N	Màu	6
8	f	\N	Màu	7
9	f	\N	Size	8
10	f	\N	Phân loại 	9
11	f	\N	Màu	10
12	f	\N	Màu	11
13	f	\N	Màu	12
14	f	\N	Size Chảo	13
\.


--
-- TOC entry 3573 (class 0 OID 29998)
-- Dependencies: 240
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (product_id, image_url) FROM stdin;
1	85b7bd6f-7b7c-4a88-a9ad-c0e66da8fd31.webp
1	e11c5423-1e23-4968-ae75-e9b3661829e4.webp
1	e5e2bc32-e4d5-4b6d-8268-2342b94b70a5.webp
2	9d5bff87-f438-498e-9222-9924feb10d7a.webp
2	157920ad-3ec2-4517-a1a2-9720d31cfa32.webp
2	d5832660-57f9-4c9b-8fa2-7ab51ced0d2c.webp
2	8c55e12c-3f76-4afb-a09d-3e4b56ddd262.webp
3	f54c865c-30a6-451c-8796-19c34f35fc97.webp
3	b10fd631-a64d-4366-b028-c95f3d5e42a6.webp
3	12972696-5f9e-48ee-9858-144296f58716.webp
3	7ffb4083-6dd2-4b35-9029-ef5665a6b44c.webp
4	bd0523fe-3e71-4dcb-858a-a1cf4b7111b1.webp
4	03818633-19ab-418e-b365-1a178e686b14.webp
4	19083f9c-39e6-4c66-9d8a-a9ad3aa66777.webp
4	e04e162c-dc7a-4976-9457-1abe7c5a7652.webp
5	65ba4ff3-5f72-41be-80e3-8703dc676ca8.webp
5	04b8c1b5-ece7-47a5-936a-cbaebfe3eb2b.webp
5	388155a8-d61f-468c-b9db-95609d6210f8.webp
5	5416bf1b-8ad7-4bed-8c51-83ba10128dce.webp
6	f2845fdb-083f-4b84-a915-da1f68f62694.webp
6	44423673-e2e4-426a-b6cc-93f19b659cc8.webp
6	e5042b18-4552-4f8b-abc1-0034c137ce6c.webp
7	0e91693d-efeb-47ce-aba3-0814ef5bc0c2.webp
7	13de1046-4852-461c-8d5e-a8778fa7259e.webp
7	329c015e-9c59-4c0e-8d01-b56b3af609fc.webp
8	13424cd8-3f13-4d22-8eb1-e9f6d2d44456.webp
8	37074d37-1a1b-4ca0-a9b7-aee631198aa7.webp
8	686d9e5a-1d5a-47cb-bb40-bfcb207dad60.webp
9	48d34223-2d97-4a8d-8863-f6710b513b43.webp
9	281e549e-d8be-443a-a431-2c54affb1f87.webp
9	b42ba484-bb8c-4e08-86f0-06a94516b8eb.webp
10	a4ea6cd3-0a2d-4f8f-a8b1-63800f64e2ae.webp
10	3c0eed02-4524-4625-a4fd-76c19ffed727.webp
10	972d09d8-444b-47a2-97d3-937da3aee17b.webp
11	ba4c291e-963f-4ace-9c66-b5d149f4044e.webp
11	c497b451-a1a4-4d6f-a37e-b0bafdde0d83.webp
11	ed5f26e3-d37a-4408-899e-7fb4251d9a75.webp
13	9cd5b5b9-7bee-46d3-be1d-ce53e53d0b9a.webp
13	b4e9eb97-a260-4e94-9093-2490bbdda93c.webp
13	554a2081-b2f8-405e-9880-5384421619b5.webp
14	e223ae5f-c3bc-4b2e-97c2-44bd046bf06b.webp
14	7653a152-c474-4b79-8771-dd9cc39a65ee.webp
14	b7455bf6-f9cc-4ca1-93d1-c08957d41c7f.webp
12	5fc161ba-7c33-4caa-8bbd-1d86728dcb8e.webp
\.


--
-- TOC entry 3575 (class 0 OID 30002)
-- Dependencies: 242
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, attributes, deleted, deleted_at, image_url, price, stock_quantity, product_id) FROM stdin;
1	{"Màu":"Xanh"}	f	\N	\N	800000.00	100	1
2	{"Màu":"Đen "}	f	\N	\N	800000.00	90	1
3	{"Màu":"Đỏ "}	f	\N	\N	1000000.00	90	1
4	{"Màu":"Đen","Size ":"M"}	f	\N	\N	89.10	100	2
5	{"Màu":"Đen","Size ":"L"}	f	\N	\N	89.10	99	2
6	{"Màu":"Đen","Size ":"XL"}	f	\N	\N	89.10	98	2
7	{"Màu":"Đen","Size ":"2XL"}	f	\N	\N	89.10	97	2
8	{"Màu":"Xanh","Size ":"M"}	f	\N	\N	91.10	96	2
9	{"Màu":"Xanh","Size ":"L"}	f	\N	\N	89.10	96	2
10	{"Màu":"Xanh","Size ":"XL"}	f	\N	\N	89.10	97	2
11	{"Màu":"Xanh","Size ":"2XL"}	f	\N	\N	89.10	97	2
12	{"Màu":"Đỏ","Size ":"M"}	f	\N	\N	89.10	97	2
13	{"Màu":"Đỏ","Size ":"L"}	f	\N	\N	89.10	102	2
14	{"Màu":"Đỏ","Size ":"XL"}	f	\N	\N	89.10	102	2
15	{"Màu":"Đỏ","Size ":"2XL"}	f	\N	\N	89.10	102	2
16	{"Màu":"Xanh "}	f	\N	\N	289.00	100	3
17	{"Màu":"Đỏ"}	f	\N	\N	289.00	90	3
18	{"Màu":"Xanh"}	f	\N	\N	100000.00	100	4
19	{"Màu":"Đỏ"}	f	\N	\N	100000.00	90	4
20	{"Màu":"Vàng"}	f	\N	\N	100000.00	80	4
21	{"Màu":"Đen"}	f	\N	\N	90000.00	50	5
22	{"Màu":"Xám"}	f	\N	\N	100000.00	100	5
23	{"Màu":"Xanh"}	f	\N	\N	269.10	100	6
24	{"Màu":"Đen"}	f	\N	\N	280000.00	90	6
25	{"Màu":"Xanh "}	f	\N	\N	80000.00	10	7
26	{"Màu":"Hồng"}	f	\N	\N	90000.00	100	7
27	{"Size":"37"}	f	\N	\N	174.30	100	8
28	{"Size":"38"}	f	\N	\N	175.00	90	8
29	{"Size":"39"}	f	\N	\N	176.00	80	8
30	{"Phân loại ":"Black"}	f	\N	\N	5716000.00	100	9
31	{"Phân loại ":"Mint"}	f	\N	\N	5716000.00	90	9
32	{"Phân loại ":"Peach Pink"}	f	\N	\N	5716000.00	80	9
33	{"Màu":"Đen "}	f	\N	\N	5919000.00	80	10
34	{"Màu":"Xanh"}	f	\N	\N	5919000.00	90	10
35	{"Màu":"Xanh"}	f	\N	\N	35990000.00	50	11
36	{"Màu":"Đỏ"}	f	\N	\N	35990000.00	50	11
40	{"Size Chảo":"23"}	f	\N	\N	208000.00	10	13
41	{"Size Chảo":"24"}	f	\N	\N	208000.00	50	13
42	{"Size Chảo":"25"}	f	\N	\N	208000.00	40	13
37	{"Màu":"Đen"}	f	\N	5fc161ba-7c33-4caa-8bbd-1d86728dcb8e.webp	209000.00	30	12
38	{"Màu":"Be 1"}	f	\N	5fc161ba-7c33-4caa-8bbd-1d86728dcb8e.webp	209000.00	30	12
39	{"Màu":"Be 2"}	f	\N	5fc161ba-7c33-4caa-8bbd-1d86728dcb8e.webp	209000.00	40	12
\.


--
-- TOC entry 3577 (class 0 OID 30012)
-- Dependencies: 244
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, average_rating, deleted, deleted_at, description, discount_percentage, discounted_price, image_url, name, price, product_status, review_count, sold, stock_quantity, violation_reason, category_id, shop_id) FROM stdin;
1	0	f	\N	Đặc điểm nổi bật\r\n\r\nThành phần: 51% Recycled Polyester + 49% Polyester\r\n\r\nVải dệt Knit - EyeLet\r\n\r\nCông nghệ ExDry thấm hút tốt, nhanh khô, thoáng khí\r\n\r\nVải co giãn thoải mái\r\n\r\nForm áo regular, tôn dáng\r\n\r\nTự hào sản xuất tại Việt Nam\r\n\r\nNgười mẫu: 181cm - 81kg, mặc áo 2XL	0	\N	85b7bd6f-7b7c-4a88-a9ad-c0e66da8fd31.webp	Áo sát nách Sleeveless tanktop thể thao Active Essentials thấm hút Coolmate	800000.00	APPROVED	0	0	100	\N	1	1
4	0	f	\N	Đặc điểm nổi bật\r\n\r\nChất liệu: 90% Polyester + 10% Spandex, dệt Knit - Mesh co giãn 4 chiều thoải mái\r\n\r\nCông nghệ ExDry thấm hút tốt, nhanh khô, thoáng khí\r\n\r\nLogo in cao thành bền bỉ, không lo bong tróc\r\n\r\nForm dáng: Regulart fit\r\n\r\nNgười mẫu: 179cm - 80kg, mặc áo 2XL	0	\N	bd0523fe-3e71-4dcb-858a-a1cf4b7111b1.webp	Áo Thun Gym thể thao Essentials II co giãn 4 chiều thấm hút Coolmate	100000.00	APPROVED	0	0	100	\N	1	1
7	0	f	\N	👕 ÁO POLO NAM YODY APM7459 – THOÁNG MÁT, LỊCH LÃM, CHỐNG NHĂN\r\n\r\n✨ ĐẶC ĐIỂM NỔI BẬT\r\n\r\nChất liệu cao cấp: Vải mắt chim với tỉ lệ 49% Cotton, 47% Polyester, 4% Spandex – mềm mịn, co giãn tốt, thoáng khí, thân thiện với làn da.\r\n\r\nThiết kế thời trang: Cổ bẻ polo cổ điển, form suông dễ mặc, phù hợp với nhiều vóc dáng. Tạo nên phong cách lịch lãm, năng động và hiện đại.\r\n\r\nChống nhăn – giữ form: Hạn chế nhàu nhĩ, không bai xù, bền màu sau nhiều lần giặt.\r\n\r\nDễ phối đồ: Mặc đi làm, đi chơi, dạo phố hay hoạt động thể thao đều phù hợp.\r\n\r\n📏 THÔNG TIN SẢN PHẨM\r\n\r\nMã sản phẩm: APM7459\r\n\r\nChất liệu: 49% Cotton – 47% Polyester – 4% Spandex\r\n\r\nKiểu dáng: Áo Polo Nam cổ bẻ\r\n\r\nMàu : Đen, Trắng, Xanh navy, Ghi,...\r\n\r\nSize: M, L, XL, XXL, 3XL\r\n\r\nThương hiệu: YODY\r\n\r\n🎁 BỘ SẢN PHẨM BAO GỒM\r\n\r\n1 x Áo Polo Nam YODY APM7459\r\n\r\n1 x Túi bảo quản thời trang (nếu có theo chính sách shop)\r\n\r\n🧼 HƯỚNG DẪN BẢO QUẢN\r\n\r\nGiặt máy chế độ nhẹ hoặc giặt tay\r\n\r\nKhông dùng thuốc tẩy mạnh\r\n\r\nPhơi nơi thoáng mát, tránh nắng gắt\r\n\r\nỦi nhẹ ở nhiệt độ trung bình\r\n\r\n#YODY #AoPoloNam #APM7459 #AoThunNam #ThoiTrangNam #AoCottonNam #AoCoBeNam #AoNamThoangMat #AoNamChongNhan #AoNamCoGian	0	\N	0e91693d-efeb-47ce-aba3-0814ef5bc0c2.webp	Áo Polo Nam YODY– Vải Cotton Mắt Chim Co Giãn – Thoáng Mát, Chống Nhăn – Áo Thun Có Cổ Nam APM7459	80000.00	APPROVED	0	0	99	\N	1	2
2	0	f	\N	-Chất vải nhẹ, thoáng khí và có độ bền cao.\r\n\r\n-Ít nhăn, dễ bảo quản và nhanh khô.\r\n\r\n-Khả năng thấm hút tốt.\r\n\r\n-Giữ form tốt, không bị co giãn nhiều sau khi giặt.	0	\N	9d5bff87-f438-498e-9222-9924feb10d7a.webp	Áo Ba Lỗ Nam Mặc Trong Thoáng Khí, Excool Coolmate	89.10	APPROVED	0	0	100	\N	1	1
5	0	f	\N	Mũ coolmate	0	\N	65ba4ff3-5f72-41be-80e3-8703dc676ca8.webp	Mũ lưỡi trai chạy bộ unisex chơi thể thao, hoạt động ngoài ngời thoáng mát Coolmate	100000.00	APPROVED	0	1	99	\N	1	1
3	0	f	\N	Bạn có bất ngờ nếu Coolmate nói rằng chiếc áo Polo này được làm từ nguyên liệu tái chế, bền vững và thân thiện với môi trường. Coolmate tin chiếc Áo Polo nam Cafe này chính là chiếc áo thực sự xứng đáng có trong tủ đồ của bạn với công nghệ xử lý và may vượt trội đem lại trải nghiệm tốt nhất đến bạn. \r\n\r\nChất liệu: 50% S.Café + 50% Recycled PET, đem đến sự mềm mại và khử mùi hiệu quả\r\n\r\nỨng dụng công nghệ Hydroponic tăng khả năng bốc hơi nước khỏi vải, giúp nhanh khô\r\n\r\nChỉ số chống tia UV tự nhiên lên đến >95%\r\n\r\nĐiều hoà và làm mát cơ thể, giảm 1-2*C so với vải thường\r\n\r\nPhần bo cổ sản xuất tại nhà máy chất lượng cao, sử dụng sợi Hightwisted 45D/75D tạo co giãn và bền form\r\n\r\nNguyên liệu bền vững, thân thiện với môi trường\r\n\r\n\r\n\r\nNgười mẫu:\r\n\r\n1m86 - 72kg; mặc áo size XL	0	\N	f54c865c-30a6-451c-8796-19c34f35fc97.webp	Áo Polo nam SCafé nam tính khử mùi hiệu quả Coolmate	28900.00	APPROVED	0	0	100	\N	1	1
6	0	f	\N	1. Chất liệu: WAFFLE với các tính năng:\r\n\r\nCông nghệ dệt với hàng triệu ô thoáng khí lấy cảm hứng từ chiếc bánh waffle mang lại sự thoáng khí, mát mẻ cho người mặc\r\n\r\n- Chạm mát tức thì\r\n\r\n- Waffle xốp khí, siêu co giãn kết hợp thoáng khí, giúp vận động linh hoạt.\r\n\r\n- Siêu thoáng khí nhờ bề mặt dệt ô thoáng, cũng giúp hạn chế bám dính da khi đổ mồ hôi\r\n\r\n- Spandex giúp co giãn siêu việt gấp đôi thông thường (~15%), giữ phom bền lâu.\r\n\r\n2. Thiết kế\r\n\r\n- Chi tiết sản phẩm: Phom dáng slimfit ôm vừa phải, tôn dáng, thiết kế tinh tế với chi tiết phối màu bo cổ thanh lịch, sang trọng, dễ dàng sử dụng\r\n\r\nThành phần\r\n\r\n- Vải chính : Waffle siêu co giãn - 82% Nylon, 18% Spandex\r\n\r\n- Bo : Bo polyester spandex CT3-170 - 95%Polyester, 5%Spandex\r\n\r\nKiểu dệt waffle giúp tạo nên sự thông thoáng không gây bí nóng trên da\r\n\r\nSiêu co giãn và đàn hồi nhờ kết cấu dệt waffle cùng với sợi spandex\r\n\r\nMềm mại, thông thoáng\r\n\r\nThấm hút mồ hôi tốt\r\n\r\nChạm mát tức thì: Qmax: 0.17 (từ sợi Nylon)\r\n\r\n#polo #aopolo #aonam #aothun #aophong #yody #chammattucthi #thamhut #thoangmat #cogian 	0	\N	f2845fdb-083f-4b84-a915-da1f68f62694.webp	Áo Polo Nam Yody Vải Siêu Co Giãn Bo Cổ Dệt Thoải Mái Hạn Chế Bám Mồ Hôi MCPO25S037	269100.00	APPROVED	0	0	100	\N	2	2
8	0	f	\N	Áo thun thể thao YODY Sport dệt Jacquard thoáng khí, co giãn, mặc mát MATS25S021\r\n\r\n\r\n\r\nMô tả sản phẩm\r\n\r\n\r\n\r\nÁo thun thể thao YODY Sport MATS25S021 là lựa chọn hoàn hảo cho những ai yêu thích vận động và phong cách năng động. Sản phẩm được dệt Jacquard cao cấp, mang lại độ thoáng khí vượt trội và khả năng co giãn linh hoạt, giúp bạn luôn cảm thấy thoải mái, khô ráo trong mọi chuyển động.\r\n\r\n\r\n\r\nDáng áo thể thao năng động kết hợp chất liệu bền bỉ giúp giữ form tốt, ít nhăn, nhanh khô – phù hợp cho cả tập luyện thể thao và mặc hàng ngày.\r\n\r\n\r\n\r\nThành phần\r\n\r\n\r\n\r\n92,8% Polyester\r\n\r\n7,2% Spandex\r\n\r\n\r\n\r\nƯu điểm nổi bật\r\n\r\n\r\n\r\n💨 Thoáng khí vượt trội: Cấu trúc dệt Jacquard tạo bề mặt thông thoáng, hỗ trợ lưu thông không khí, giúp cơ thể luôn mát mẻ.\r\n\r\n💪 Co giãn linh hoạt: Spandex giúp vải đàn hồi tốt, dễ dàng thích ứng với mọi chuyển động khi tập luyện.\r\n\r\n💧 Thấm hút mồ hôi nhanh – khô nhanh: Giúp cơ thể luôn khô ráo, giảm bám dính, hạn chế mùi khó chịu.\r\n\r\n🧵 Bền màu – ít nhăn: Polyester có độ bền cao, chịu được giặt máy, không lo phai màu hay nhăn nhàu.\r\n\r\n👕 Dễ bảo quản: Giặt nhanh, khô nhanh, không cần ủi – tiết kiệm thời gian chăm sóc quần áo.\r\n\r\n🏃‍♂️ Phù hợp đa dạng hoạt động: Từ gym, chạy bộ, yoga, cầu lông đến mặc thường ngày đều phù hợp.\r\n\r\n\r\n\r\nThiết kế & Form dáng\r\n\r\nForm slim fit hiện đại: Ôm nhẹ cơ thể, tôn dáng thể thao khỏe khoắn.\r\n\r\nChất liệu dệt Jacquard cao cấp: Tạo điểm nhấn tinh tế và giúp áo luôn thoáng mát.\r\n\r\nThiết kế tối giản – năng động: Dễ phối cùng quần short, quần jogger hoặc quần thể thao.\r\n\r\n\r\n\r\nKhuyến cáo\r\n\r\nGIẶT MÁY CHẾ ĐỘ NHẸ VỚI SẢN PHẨM CÙNG MÀU Ở NHIỆT ĐỘ THƯỜNG\r\n\r\nKHÔNG GIẶT CHUNG VỚI CÁC VẬT SẮC NHỌN\r\n\r\nKHÔNG SỬ DỤNG CHẤT TẨY, KHÔNG NGÂM LÂU SẢN PHẨM VỚI CÁC CHẤT CÓ TÍNH TẨY RỬA\r\n\r\nSỬ DỤNG XÀ PHÒNG TRUNG TÍNH \r\n\r\nLỘN TRÁI VÀ PHƠI BẰNG MÓC TRONG BÓNG RÂM, TRÁNH ÁNH NẮNG TRỰC TIẾP\r\n\r\nLÀ ỦI Ở NHIỆT ĐỘ THẤP\r\n\r\nKHÔNG LÀ LÊN CHI TIẾT TRANG TRÍ	0	\N	13424cd8-3f13-4d22-8eb1-e9f6d2d44456.webp	Áo thun thể thao YODY Sport dệt jacquard thoáng khí MATS25S021	174000.00	APPROVED	0	0	100	\N	1	2
10	0	f	\N	Thông tin kỹ thuật và đặc điểm chi tiết chưa được cập nhật cho đến khi có thông báo từ phía nhãn hàng\r\n\r\n	0	\N	a4ea6cd3-0a2d-4f8f-a8b1-63800f64e2ae.webp	Điện Thoại Samsung Galaxy A17 5G 8GB/128GB	5919000.00	APPROVED	0	0	90	\N	3	3
9	0	f	\N	Điện thoại Samsung Galaxy A26 5G (8/128GB) -  \r\n\r\nAwesome Intelligence - Circle to Search - Chụp nét tìm nhanh, bắt trend càng xịn\r\n\r\n\r\n\r\n\r\n\r\nThông số kỹ thuật\r\n\r\n\r\n\r\nMàn Hình\r\n\r\n- Công nghệ màn hình: Super AMOLED\r\n\r\n- Độ phân giải: 1080 x 2340 (FHD+)\r\n\r\n- Kích thước: 6.7 inch\r\n\r\n- Tần số quét: 120Hz\r\n\r\n- Độ sáng tối đa: 800 nits\r\n\r\n- Mặt kính cảm ứng: Gorilla Glass Victus\r\n\r\n\r\n\r\nCamera sau\r\n\r\n- Độ phân giải: 50+8+2MP\r\n\r\n- Quay phim: UHD 4K (3840 x 2160)@30fps | Quay chậm: 480fps @HD,240fps\r\n\r\n- TÍnh năng: Zoom quang học 10x, Chụp ban đêm, Chụp toàn cảnh Panorama, Chụp một chạm, Chụp làm đẹp, Chụp chuyên nghiệp, Chế độ quay chuyển động chậm, Chế độ quay chuyển động trôi nhanh.\r\n\r\n\r\n\r\nCamera trước\r\n\r\n- Độ phân giải: 13MP\r\n\r\n- Tính năng: Chụp làm đẹp, Chụp chân dung\r\n\r\n\r\n\r\nHệ điều hành & CPU\r\n\r\n- Hệ điều hành: Android 15\r\n\r\n- CPU: Exynos 1380 (Quartz)\r\n\r\n- Tốc độ CPU: 2.4GHz,2GHz, Octa-Core\r\n\r\n- Chip đồ họa (GPU): Mali-G68\r\n\r\n\r\n\r\nBộ nhớ & Lưu trữ\r\n\r\n- RAM: 8GB\r\n\r\n- Bộ nhớ trong: 128GB\r\n\r\n- Bộ nhớ còn lại (khả dụng) khoảng: 106.5GB\r\n\r\n- Thẻ nhớ: MicroSD (Up to 2TB)\r\n\r\n\r\n\r\nKết nối\r\n\r\n- Mạng di động: Hỗ trợ 5G\r\n\r\n- Sim: 1 SIM + 1 khe đa năng (1 SIM or MicroSD)\r\n\r\n\r\n\r\nPin và sạc\r\n\r\n- Dung lượng pin: 5000 mAh\r\n\r\n- Công nghệ pin: Sạc nhanh\r\n\r\n- Hỗ trợ sạc tối đa: 25W\r\n\r\n\r\n\r\nThông tin chung\r\n\r\n- Thiết kế: Nguyên khối\r\n\r\n- Chất liệu khung viền: Nhựa\r\n\r\n- Chất liệu mặt lưng máy: Kính cường lực Gorilla Glass\r\n\r\n- Kích thước: 164.0 x 77.5 x 7.7 mm\r\n\r\n- Khối lượng: 200g	0	\N	48d34223-2d97-4a8d-8863-f6710b513b43.webp	Điện Thoại Samsung Galaxy A26 5G 8GB/128GB	5716000.00	APPROVED	0	0	100	\N	3	3
11	0	f	\N	Điện thoại Samsung Galaxy A26 5G (8/128GB) -  \r\n\r\n\r\n\r\nAwesome Intelligence - Circle to Search - Chụp nét tìm nhanh, bắt trend càng xịn\r\n\r\n\r\n\r\nThông số kỹ thuật\r\n\r\nMàn Hình\r\n\r\n- Công nghệ màn hình: Super AMOLED\r\n\r\n- Độ phân giải: 1080 x 2340 (FHD+)\r\n\r\n- Kích thước: 6.7 inch\r\n\r\n- Tần số quét: 120Hz\r\n\r\n- Độ sáng tối đa: 800 nits\r\n\r\n- Mặt kính cảm ứng: Gorilla Glass Victus\r\n\r\n\r\n\r\nCamera sau\r\n\r\n- Độ phân giải: 50+8+2MP\r\n\r\n- Quay phim: UHD 4K (3840 x 2160)@30fps | Quay chậm: 480fps @HD,240fps\r\n\r\n- TÍnh năng: Zoom quang học 10x, Chụp ban đêm, Chụp toàn cảnh Panorama, Chụp một chạm, Chụp làm đẹp, Chụp chuyên nghiệp, Chế độ quay chuyển động chậm, Chế độ quay chuyển động trôi nhanh.\r\n\r\n\r\n\r\nCamera trước\r\n\r\n- Độ phân giải: 13MP\r\n\r\n- Tính năng: Chụp làm đẹp, Chụp chân dung\r\n\r\n\r\n\r\nHệ điều hành & CPU\r\n\r\n- Hệ điều hành: Android 15\r\n\r\n- CPU: Exynos 1380 (Quartz)\r\n\r\n- Tốc độ CPU: 2.4GHz,2GHz, Octa-Core\r\n\r\n- Chip đồ họa (GPU): Mali-G68\r\n\r\n\r\n\r\nBộ nhớ & Lưu trữ\r\n\r\n- RAM: 8GB\r\n\r\n- Bộ nhớ trong: 128GB\r\n\r\n- Bộ nhớ còn lại (khả dụng) khoảng: 106.5GB\r\n\r\n- Thẻ nhớ: MicroSD (Up to 2TB)\r\n\r\n\r\n\r\nKết nối\r\n\r\n- Mạng di động: Hỗ trợ 5G\r\n\r\n- Sim: 1 SIM + 1 khe đa năng (1 SIM or MicroSD)\r\n\r\n\r\n\r\nPin và sạc\r\n\r\n- Dung lượng pin: 5000 mAh\r\n\r\n- Công nghệ pin: Sạc nhanh\r\n\r\n- Hỗ trợ sạc tối đa: 25W\r\n\r\n\r\n\r\nThông tin chung\r\n\r\n- Thiết kế: Nguyên khối\r\n\r\n- Chất liệu khung viền: Nhựa\r\n\r\n- Chất liệu mặt lưng máy: Kính cường lực Gorilla Glass\r\n\r\n- Kích thước: 164.0 x 77.5 x 7.7 mm\r\n\r\n- Khối lượng: 200g	0	\N	ba4c291e-963f-4ace-9c66-b5d149f4044e.webp	Điện thoại Samsung Galaxy S26+, 12GB/512GB, Customized AP, AI Phone, Photo Assist, Creative Studio, 50MP Camera, 4900mAh	35990000.00	APPROVED	0	0	100	\N	3	3
14	0	f	\N	Thông tin Máy ép chậm trái cây Elmich JEE 1855OL\r\n\r\n- Công suất: 240W\r\n\r\n- Điện áp: 220VAC/50Hz\r\n\r\n- Chức năng : ép nước rau, củ, trái cây. Hỗ trợ làm kem với các thực phẩm mềm dẻo như xoài , chuối hoặc các thực phẩm trái cây đông khô mềm.\r\n\r\n- Chất liệu: Inox và nhựa cao cấp\r\n\r\n- Độ ồn tối đa: ≤ 65dB\r\n\r\n- Bảo hành : 24 tháng\r\n\r\n- Khóa nắp bảo vệ an toàn với trẻ em\r\n\r\n\r\n\r\n Trọng lượng 4316g\r\n\r\n Bảo hành 24 tháng, 1 đổi 1 trong vòng 12 tháng nếu lỗi kỹ thuật.\r\n\r\n Xuất xứ Trung Quốc\r\n\r\n\r\n\r\nĐặc tính sản phẩm\r\n\r\n- Động cơ được quấn bằng đồng nguyên chất với công suất 240W sử dụng điện 1 chiều, giúp động cơ DC chạy êm ái và bền bỉ với thời gian. \r\n\r\n- Với tốc độ quay chậm 60 vòng/ phút, nước ép được ép ra một cách từ từ, giữ trọn hương vị và chất dinh dưỡng có trong hoa quả mà không xảy ra phản ứng hóa học, phá hỏng chất dinh dưỡng của nước ép. \r\n\r\n- Lưới lọc được làm bằng inox 304 và chất liệu nhựa an toàn thực phẩm. Lỗ thoát có đường kính chỉ 0.2mm giúp ép kiệt nước của các loại trái cây và cho ra những ly sinh tố thơm ngon, tinh khiết.\r\n\r\n- Trục ép được làm từ nhựa an toàn thực phẩm với chiều dài 140mm, tạo thành 7 cấp độ ép khác nhau.\r\n\r\n- An toàn cho trẻ nhỏ với khóa nắp bảo vệ\r\n\r\n- Đường kính miệng tiếp thực phẩm lớn 70mm, giúp dễ dàng đưa thực phẩm vào mà không cần thái cắt nhỏ. \r\n\r\n- Êm ái khi sử dụng với độ ồn tối đa khi sử dụng chỉ 65dB	0	\N	e223ae5f-c3bc-4b2e-97c2-44bd046bf06b.webp	[Mã ELBSJBP03 giảm 12% đơn 500K] Máy ép chậm trái cây Elmich JEE 1855OL	1954000.00	APPROVED	0	0	100	\N	15	4
12	0	f	\N	Bình giữ nhiệt inox 316 Elmich EL8315 dung tích 480ml\r\n\r\nThông tin sản phẩm\r\n\r\n– Chất liệu inox 316 an toàn tuyệt đối cho sức khỏe.\r\n\r\n– Cách nhiệt tuyệt đối bằng chân không.\r\n\r\n– Giữ nóng 12 tiếng, giữ lạnh 36 tiếng\r\n\r\n– Dung tích 480ml phù hợp nhiều đối tượng sử dụng\r\n\r\n-  màu xanh đậm phù hợp cho nam, màu xanh nhạt phù hợp cho nữ\r\n\r\n– Nắp ngoài tích hợp cốc uống. Nắp trong 1 chạm, tích hợp lưới lọc trà bằng inox 304, có thể bật mở uống trực tiếp hoặc rót ra nắp uống.\r\n\r\nThông số kỹ thuật\r\n\r\nMàu sắc :  nhiều màu \r\n\r\nDung tích : 480 ml\r\n\r\nCông dụng: Giữ nhiệt nóng, lạnh\r\n\r\nChất liệu : Lóp trong bình  Inox 316 ; Lớp vỏ ngoài + nắp : inox 304 \r\n\r\nTrọng lượng tịnh sản phẩm : 380g\r\n\r\nKích thước sản phẩm : 60 x 60 x 235 mm\r\n\r\nBảo hành : 6 tháng cho tính năng giữ nhiệt\r\n\r\nXuất xứ : Trung Quốc	0	\N	5fc161ba-7c33-4caa-8bbd-1d86728dcb8e.webp	Bình giữ nhiệt inox 316 Elmich EL8315 dung tích 480ml	209000.00	APPROVED	0	0	100	\N	15	4
13	0	f	\N	Chảo chống dính siêu bền elmich EL-4711OL size 20,24,26,28cm\r\n\r\nThông số kỹ thuật\r\n\r\n2354711OL20:  Size 20 cm Kích thước (Đường kính x Chiều cao x Độ dày đáy (cm)) : 20 x 5.3 x 0.24\r\n\r\n2354711OL24:  Size 24 cm Kích thước (Đường kính x Chiều cao x Độ dày đáy (cm)) : 24 x 5,9 x 0,24\r\n\r\n2354711OL26 : Size 26 cm Kích thước (Đường kính x Chiều cao x Độ dày đáy (cm)): 26 x 6.2 x 0,24\r\n\r\n2354711OL28 :  Size 28 cm Kích thước (Đường kính x Chiều cao x Độ dày đáy (cm)) : 28 x 6,5 x 0,24\r\n\r\n\r\n\r\n\r\n\r\nLàm bằng hợp kim nhôm, bên trong phủ 2 lớp chống dính\r\n\r\nĐáy dày 2.4mm, miệng dày 2.4mm\r\n\r\nCán chảo bakelit ốp inox cách điệu, chịu nhiệt\r\n\r\nMàu sắc : Vàng chanh\r\n\r\nXuất xứ : Việt Nam\r\n\r\nĐặc tính sản phẩm\r\n\r\n\r\n\r\nNhôm dập nguyên khối dày dặn, tỏa nhiệt đều: Chảo được làm bằng nhôm nguyên chất giúp truyền nhiệt nhanh, tỏa nhiệt đều nhờ đó tiết kiệm thời gian và nhiên liệu khi nấu nướng. Đặc biệt, chất liệu nhôm nguyên chất không chứa tạp chất có hại, an toàn tuyệt đối cho sức khỏe.\r\n\r\n\r\n\r\nChống dính ưu việt: Bề mặt lòng chảo phủ 2 lớp chống dính cao cấp Greblon C2 (Đức)siêu bền, chống bám bẩn, chịu nhiệt lên đến 250 độ C. Đây là loại chống dính an toàn tuyệt đối cho sức khỏe, không chứa các chất có hại như PFOA, APEO.\r\n\r\n\r\n\r\nTương thích mọi loại bếp: Chảo đáy từ có thể linh hoạt sử dụng trên mọi loại bếp: bếp từ, bếp hồng ngoại, bếp gas.\r\n\r\n\r\n\r\nThiết kế đơn giản, tiện lợi\r\n\r\n\r\n\r\nKiểu dáng hiện đại: Bề mặt bên ngoài chảo màu vàng kem dịu nhẹ, sang trọng ;  được phủ sơn chống bám bẩn Whitford giúp dễ dàng vệ sinh, lau rửa. Lòng chảo phủ chống dính màu khói vàng trơn nhẵn đem đến diện mạo trẻ trung, hiện đại.\r\n\r\n\r\n\r\nTay cầm: Tay cầm chảo được làm bằng nhựa bakelite chịu nhiệt đến 180 độ C, được bắt vít chắc chắn vào thân chảo, đảm bảo an toàn cho quá trình sử dụng, di chuyển. Phía cuối tay cầm còn được thiết kế lỗ móc treo tiện dụng\r\n\r\n\r\n\r\nThiết kế thành chảo cao 5.9cm với độ dày 2.4mm chắn chắn, lòng chảo sâu thích hợp với nhiều món ăn: nấu, xào, rán,… đồng thời hạn chế dầu mỡ bắn ra ngoài, đảm bảo an toàn trong quá trình nấu nướng, giúp cho gian bếp của bạn lúc nào cũng sạch sẽ.	0	\N	9cd5b5b9-7bee-46d3-be1d-ce53e53d0b9a.webp	Chảo chống dính siêu bền elmich EL-4711OL size 20,24,26,28cm	208000.00	APPROVED	0	0	100	\N	6	4
\.


--
-- TOC entry 3578 (class 0 OID 30026)
-- Dependencies: 245
-- Data for Name: review_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_images (review_id, image_url) FROM stdin;
\.


--
-- TOC entry 3580 (class 0 OID 30030)
-- Dependencies: 247
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, comment, created_at, deleted, deleted_at, rating, order_id, product_id, user_id) FROM stdin;
\.


--
-- TOC entry 3582 (class 0 OID 30038)
-- Dependencies: 249
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shops (id, avatar_url, deleted, deleted_at, description, name, owner_id) FROM stdin;
1	\N	f	\N	Chào mừng đến với cửa hàng của Coolmate - Official Store	Coolmate - Official Store	2
2	\N	f	\N	Chào mừng đến với cửa hàng của YODY Official Store	YODY Official Store	3
3	\N	f	\N	Chào mừng đến với cửa hàng SAMSUNG OFFICIAL STORE	SAMSUNG OFFICIAL STORE	4
4	\N	f	\N	Chào mừng đến với cửa hàng của Elmich Việt Nam Chính Hãng	Elmich Việt Nam Chính Hãng	5
\.


--
-- TOC entry 3584 (class 0 OID 30048)
-- Dependencies: 251
-- Data for Name: sliders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sliders (id, created_at, deleted, deleted_at, display_order, image_url, is_active, link, title, updated_at) FROM stdin;
\.


--
-- TOC entry 3586 (class 0 OID 30058)
-- Dependencies: 253
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, created_at, deleted, deleted_at, email, is_locked, password, role, seller_status, username) FROM stdin;
1	2026-03-03 22:02:01.574407	f	\N	admin@gmail.com	f	$2a$12$F0oZ/83Z/3cAbNZzdSFEiOjZtxIs.sECFtnY7el.bcGFdL4k3ERQK	ADMIN	\N	admin
2	2026-03-03 22:08:51.627814	f	\N	usertest1@gmail.com	f	$2a$10$FgSUodc4HD/cW4L8x6I/MesUSOiZY91n6uOR1NpHWkKeiflyu6ZO2	SELLER	APPROVED	usertest1
3	2026-03-03 22:40:02.006956	f	\N	usertest2@gmail.com	f	$2a$10$jtXFpdZTP3eBHp9gGnyG..bAUwSdtdbqOsrx6wHFCcnGrTQTU6eJq	SELLER	APPROVED	usertest2
4	2026-03-03 22:52:10.86584	f	\N	usertest3@gmail.com	f	$2a$10$xI7bCsgHXW2SEDiKaxLH/.6TFrXgflLyIvKqw8KrTC0kOwlsT9S0a	SELLER	APPROVED	usertest3
5	2026-03-03 22:59:47.540017	f	\N	usertest4@gmail.com	f	$2a$10$FJR4D/Fsi9JNGIhzAiX3DeebcAYBFS/qEuO72eZwTRt3si1XOEYWW	SELLER	APPROVED	usertest4
\.


--
-- TOC entry 3588 (class 0 OID 30070)
-- Dependencies: 255
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vouchers (id, code, deleted, deleted_at, discount_type, discount_value, end_date, min_order_value, start_date, usage_limit, shop_id) FROM stdin;
1	SALE50	f	\N	PERCENTAGE	20.00	2026-04-28 22:59:00	100000.00	2026-03-03 22:59:19	100	\N
\.


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 214
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, true);


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 216
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 1, false);


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 218
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 5, true);


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 220
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 27, true);


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 222
-- Name: conversations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conversations_id_seq', 1, false);


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 224
-- Name: flash_sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flash_sale_items_id_seq', 11, true);


--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 226
-- Name: flash_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.flash_sales_id_seq', 1, true);


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 228
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 16, true);


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 232
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, true);


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 234
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, true);


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 236
-- Name: product_attribute_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_attribute_options_id_seq', 37, true);


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 238
-- Name: product_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_attributes_id_seq', 14, true);


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 42, true);


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 243
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 14, true);


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 246
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 248
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shops_id_seq', 4, true);


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 250
-- Name: sliders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sliders_id_seq', 1, false);


--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 252
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 254
-- Name: vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vouchers_id_seq', 1, true);


--
-- TOC entry 3328 (class 2606 OID 29888)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 3330 (class 2606 OID 29896)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3332 (class 2606 OID 29904)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 29914)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3338 (class 2606 OID 29922)
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 29930)
-- Name: flash_sale_items flash_sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT flash_sale_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 29938)
-- Name: flash_sales flash_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT flash_sales_pkey PRIMARY KEY (id);


--
-- TOC entry 3344 (class 2606 OID 29948)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3346 (class 2606 OID 29959)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3348 (class 2606 OID 29967)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3350 (class 2606 OID 29979)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3352 (class 2606 OID 29989)
-- Name: product_attribute_options product_attribute_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options
    ADD CONSTRAINT product_attribute_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 29997)
-- Name: product_attributes product_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT product_attributes_pkey PRIMARY KEY (id);


--
-- TOC entry 3356 (class 2606 OID 30010)
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- TOC entry 3358 (class 2606 OID 30025)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3360 (class 2606 OID 30036)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3362 (class 2606 OID 30046)
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 30056)
-- Name: sliders sliders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sliders
    ADD CONSTRAINT sliders_pkey PRIMARY KEY (id);


--
-- TOC entry 3374 (class 2606 OID 30089)
-- Name: vouchers uk_30ftp2biebbvpik8e49wlmady; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT uk_30ftp2biebbvpik8e49wlmady UNIQUE (code);


--
-- TOC entry 3334 (class 2606 OID 30081)
-- Name: carts uk_64t7ox312pqal3p7fg9o503c2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT uk_64t7ox312pqal3p7fg9o503c2 UNIQUE (user_id);


--
-- TOC entry 3368 (class 2606 OID 30085)
-- Name: users uk_6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- TOC entry 3364 (class 2606 OID 30083)
-- Name: shops uk_6x3im56qg96va2stnwgkk7vtm; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT uk_6x3im56qg96va2stnwgkk7vtm UNIQUE (owner_id);


--
-- TOC entry 3370 (class 2606 OID 30087)
-- Name: users uk_r43af9ap4edm43mmtq01oddj6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk_r43af9ap4edm43mmtq01oddj6 UNIQUE (username);


--
-- TOC entry 3372 (class 2606 OID 30068)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3376 (class 2606 OID 30079)
-- Name: vouchers vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_pkey PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 30090)
-- Name: addresses fk1fa36y2oqhao3wgg2rw1pi459; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk1fa36y2oqhao3wgg2rw1pi459 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3378 (class 2606 OID 30100)
-- Name: cart_items fk1re40cjegsfvw58xrkdp6bac6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk1re40cjegsfvw58xrkdp6bac6 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3390 (class 2606 OID 30160)
-- Name: orders fk32ql8ubntj5uh44ph9659tiih; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3399 (class 2606 OID 30200)
-- Name: review_images fk3aayo5bjciyemf3bvvt987hkr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_images
    ADD CONSTRAINT fk3aayo5bjciyemf3bvvt987hkr FOREIGN KEY (review_id) REFERENCES public.reviews(id);


--
-- TOC entry 3385 (class 2606 OID 30135)
-- Name: messages fk4ui4nnwntodh6wjvck53dbk9m; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fk4ui4nnwntodh6wjvck53dbk9m FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- TOC entry 3383 (class 2606 OID 30125)
-- Name: flash_sale_items fk5p9e16gsvvhlc28cjyvju7m99; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fk5p9e16gsvvhlc28cjyvju7m99 FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3397 (class 2606 OID 30195)
-- Name: products fk7kp8sbhxboponhx3lxqtmkcoj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk7kp8sbhxboponhx3lxqtmkcoj FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- TOC entry 3381 (class 2606 OID 30110)
-- Name: conversations fk8wv0rmd8jb3cqcbyng15ubrmk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fk8wv0rmd8jb3cqcbyng15ubrmk FOREIGN KEY (user1_id) REFERENCES public.users(id);


--
-- TOC entry 3387 (class 2606 OID 30140)
-- Name: notifications fk9y21adhxn0ayjhfocscqox7bh; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk9y21adhxn0ayjhfocscqox7bh FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3380 (class 2606 OID 30105)
-- Name: carts fkb5o626f86h46m4s7ms6ginnop; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fkb5o626f86h46m4s7ms6ginnop FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3388 (class 2606 OID 30145)
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3394 (class 2606 OID 30175)
-- Name: product_attributes fkcex46yvx4g18b2pn09p79h1mc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attributes
    ADD CONSTRAINT fkcex46yvx4g18b2pn09p79h1mc FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3400 (class 2606 OID 30215)
-- Name: reviews fkcgy7qjc1r99dp117y9en6lxye; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkcgy7qjc1r99dp117y9en6lxye FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3391 (class 2606 OID 30165)
-- Name: orders fkdimvsocblb17f45ikjr6xn1wj; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkdimvsocblb17f45ikjr6xn1wj FOREIGN KEY (voucher_id) REFERENCES public.vouchers(id);


--
-- TOC entry 3382 (class 2606 OID 30115)
-- Name: conversations fke7w0k1xem21pp85wxh5moodnk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT fke7w0k1xem21pp85wxh5moodnk FOREIGN KEY (user2_id) REFERENCES public.users(id);


--
-- TOC entry 3404 (class 2606 OID 30225)
-- Name: vouchers fkfp0uiuo0q1alv0h9arfn9vafn; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT fkfp0uiuo0q1alv0h9arfn9vafn FOREIGN KEY (shop_id) REFERENCES public.shops(id);


--
-- TOC entry 3392 (class 2606 OID 30155)
-- Name: orders fkmk6q95x8ffidq82wlqjaq7sqc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fkmk6q95x8ffidq82wlqjaq7sqc FOREIGN KEY (shipping_address_id) REFERENCES public.addresses(id);


--
-- TOC entry 3384 (class 2606 OID 30120)
-- Name: flash_sale_items fkmr5agn0eu29xqqog30yspa3e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flash_sale_items
    ADD CONSTRAINT fkmr5agn0eu29xqqog30yspa3e3 FOREIGN KEY (flash_sale_id) REFERENCES public.flash_sales(id);


--
-- TOC entry 3393 (class 2606 OID 30170)
-- Name: product_attribute_options fknh6mqpegmo0urhlbg9ul0w2cm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_attribute_options
    ADD CONSTRAINT fknh6mqpegmo0urhlbg9ul0w2cm FOREIGN KEY (attribute_id) REFERENCES public.product_attributes(id);


--
-- TOC entry 3389 (class 2606 OID 30150)
-- Name: order_items fkocimc7dtr037rh4ls4l95nlfi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkocimc7dtr037rh4ls4l95nlfi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3398 (class 2606 OID 30190)
-- Name: products fkog2rp4qthbtt2lfyhfo32lsw9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fkog2rp4qthbtt2lfyhfo32lsw9 FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 3396 (class 2606 OID 30185)
-- Name: product_variants fkosqitn4s405cynmhb87lkvuau; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT fkosqitn4s405cynmhb87lkvuau FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3379 (class 2606 OID 30095)
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- TOC entry 3401 (class 2606 OID 30210)
-- Name: reviews fkpl51cejpw4gy5swfar8br9ngi; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkpl51cejpw4gy5swfar8br9ngi FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3395 (class 2606 OID 30180)
-- Name: product_images fkqnq71xsohugpqwf3c9gxmsuy; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT fkqnq71xsohugpqwf3c9gxmsuy FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 3402 (class 2606 OID 30205)
-- Name: reviews fkqwgq1lxgahsxdspnwqfac6sv6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fkqwgq1lxgahsxdspnwqfac6sv6 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3403 (class 2606 OID 30220)
-- Name: shops fkrduswa89ayj0poad3l70nag19; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shops
    ADD CONSTRAINT fkrduswa89ayj0poad3l70nag19 FOREIGN KEY (owner_id) REFERENCES public.users(id);


--
-- TOC entry 3386 (class 2606 OID 30130)
-- Name: messages fkt492th6wsovh1nush5yl5jj8e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT fkt492th6wsovh1nush5yl5jj8e FOREIGN KEY (conversation_id) REFERENCES public.conversations(id);


-- Completed on 2026-03-03 23:15:00

--
-- PostgreSQL database dump complete
--

\unrestrict ogEeN0VndgoHXxNVkwP5VUbVHLNIyuSlamKIvlBzOtAAjCRBcREf2nyGbN2qbeL

