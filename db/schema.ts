import { pgTable, text, timestamp, boolean, serial, integer, real } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text("username").unique(),
  displayUsername: text("display_username"),
  role: text("role").default("user"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  phoneNumber: text("phoneNumber").unique(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
}); 


export const products = pgTable('products', {
  product_id: serial('product_id').primaryKey(),
   imageKit_productFiles_id: integer("imageKit_productFiles_id")
    .references(() => imageKit_productFiles.id, { onDelete: "cascade" }),
  product_name: text('product_name').notNull(),
  product_category: text('product_category').notNull(),
  product_price: real('product_price').notNull(),
  bonsai_size: text('bonsai_size'),
  bonsai_category: text('bonsai_category'),
  bonsai_age: text('bonsai_age'),
  bonsai_care_level: text("bonsai_care_level"),
  product_desc: text('product_desc').notNull(),
  stock: integer('stock').notNull(),
  rating: integer('rating')
});

export const imageKit_productFiles = pgTable('imageKit_productFiles', {
  id: serial('image_id').primaryKey(),
  product_image_id: text('product_image_id').notNull().unique(),
  product_image_url: text('product_image_url').notNull(),
  user_id: text('user_id').notNull().references(() => user.id),
  upload_timestamp: timestamp().defaultNow()
})

export const cart_status = pgTable('cart_status', {
  cart_status_id: serial('cart_status_id').primaryKey(),
  cart_status_name: text('cart_status_name')
    .notNull()
    .default('new')
})

export const carts = pgTable('carts', {
  cart_id: serial('cart_id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  cart_status_id: integer('cart_status_id')
    .notNull()
    .references(() => cart_status.cart_status_id, { onDelete: 'cascade' })
})

export const cart_products = pgTable('cart_products', {
  cart_products_id: serial('cart_products_id').primaryKey(),
  cart_id: integer('cart_id')
    .notNull()
    .references(() => carts.cart_id, { onDelete: 'cascade' }),
  product_id: integer('product_id')
    .notNull()
    .references(() => products.product_id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(),
})

export const order_status = pgTable('order_status', {
  order_status_id: serial('order_status_id').primaryKey(),
  order_status_name: text('order_status_name')
    .notNull()
    .default('pending')
})

export const orders = pgTable('orders', {
  order_id: serial('order_id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  order_status_id: integer('order_status_id')
    .notNull()
    .references(() => order_status.order_status_id, { onDelete: 'cascade' }),
  paypal_order_id: text('paypal_order_id'), 
  payment_status: text('payment_status').default('pending'), 
  created_at: timestamp('created_at')
    .notNull()
    .defaultNow(),
  updated_at: timestamp('updated_at')
    .notNull()
    .defaultNow()
})

export const order_products = pgTable('order_products', {
  order_products_id: serial('order_products_id').primaryKey(),
  order_id: integer('order_id')
    .notNull()
    .references(() => orders.order_id, { onDelete: 'cascade' }),
  product_id: integer('product_id')
    .notNull()
    .references(() => products.product_id, { onDelete: 'cascade' }),
  quantity: real('quantity').notNull(),
  price_at_purchase: real('price_at_purchase').notNull()
})

export const address = pgTable("address", {
  address_id: serial("address_id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  city: text("city").notNull(),
  province: text("province").notNull(),
  postal_code: text("postal_code"),
  special_instructions: text("special_instructions"),
});

export const reviews = pgTable("reviews", {
  review_id: serial("review_id").primaryKey(),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.product_id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at")
    .notNull()
    .defaultNow()
})

export const refund = pgTable("refund", {
  refund_id: serial("refund_id").primaryKey(),
  order_id: integer("order_id")
    .notNull()
    .references(() => orders.order_id, { onDelete: "cascade" }),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  reason: text("reason").notNull(),
  refund_type: text("refund_type").notNull().default("full"),   // full or partial
  comments: text("comments"),
  status: text("status").notNull().default("pending"), 
    stock_restored: boolean("stock_restored").default(false),
  stock_restored_at: timestamp("stock_restored_at"),
  admin_notes: text("admin_notes"),
  processed_by: text("processed_by"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const refund_items = pgTable("refund_items", {
  refund_item_id: serial("refund_item_id").primaryKey(),
  refund_id: integer("refund_id")
    .notNull()
    .references(() => refund.refund_id, { onDelete: "cascade" }),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.product_id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull(),
  condition: text("condition").notNull(), // 'resellable', 'defective', 'damaged', 'dead_plant', 'broken'
  restocked: boolean("restocked").default(false), // if stock was restored
  restocked_at: timestamp("restocked_at"),
  notes: text("notes"), // Specific notes about this item
  created_at: timestamp("created_at").notNull().defaultNow(),
});


export const schema = { 
  user,
  session, 
  account, 
  verification, 
  products, 
  imageKit_productFiles,
  cart_status,
  carts,
  cart_products,
  order_status,
  orders,
  order_products,
  address,
  reviews,
  refund
}
  


export type User = typeof user.$inferSelect
