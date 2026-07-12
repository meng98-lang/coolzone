import { pgTable, serial, timestamp, varchar, text, boolean, integer, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// System health check table (DO NOT DELETE)
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Contact form inquiries
export const inquiries = pgTable(
	"inquiries",
	{
		id: serial().primaryKey(),
		name: varchar("name", { length: 100 }).notNull(),
		email: varchar("email", { length: 255 }).notNull(),
		phone: varchar("phone", { length: 50 }),
		message: text("message").notNull(),
		product_name: varchar("product_name", { length: 200 }),
		is_read: boolean("is_read").default(false).notNull(),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("inquiries_created_at_idx").on(table.created_at),
		index("inquiries_is_read_idx").on(table.is_read),
	]
);

// Site settings (single row)
export const settings = pgTable(
	"settings",
	{
		id: serial().primaryKey(),
		whatsapp_phone: varchar("whatsapp_phone", { length: 50 }).notNull().default("499876543210"),
		facebook_pixel_id: varchar("facebook_pixel_id", { length: 100 }),
		google_analytics_id: varchar("google_analytics_id", { length: 100 }),
		tiktok_pixel_id: varchar("tiktok_pixel_id", { length: 100 }),
		admin_password: varchar("admin_password", { length: 100 }).notNull().default("coolzone2024"),
		updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
	}
);

// Traffic analytics
export const traffic = pgTable(
	"traffic",
	{
		id: serial().primaryKey(),
		date: varchar("date", { length: 10 }).notNull(),
		path: varchar("path", { length: 500 }).notNull(),
		country: varchar("country", { length: 10 }),
		referrer: text("referrer"),
		user_agent: text("user_agent"),
		search_keyword: varchar("search_keyword", { length: 500 }),
		created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
	},
	(table) => [
		index("traffic_date_idx").on(table.date),
		index("traffic_path_idx").on(table.path),
		index("traffic_country_idx").on(table.country),
	]
);
