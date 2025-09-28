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
});

export const imageKit_productFiles = pgTable('imageKit_productFiles', {
  id: serial('image_id').primaryKey(),
  product_image_id: text('product_image_id').notNull().unique(),
  product_image_url: text('product_image_url').notNull(),
  user_id: text('user_id').notNull().references(() => user.id),
  upload_timestamp: timestamp().defaultNow()
})

export const schema = { user, session, account, verification, products, imageKit_productFiles }