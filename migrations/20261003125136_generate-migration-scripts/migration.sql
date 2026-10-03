CREATE TABLE "author" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "author_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "book_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"isbn" varchar(13) NOT NULL UNIQUE,
	"description" text,
	"cover_img" text,
	"total_pages" integer NOT NULL,
	"published_year" integer NOT NULL,
	"author_id" integer NOT NULL,
	"genre_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genre" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "genre_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_author_id_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id");--> statement-breakpoint
ALTER TABLE "book" ADD CONSTRAINT "book_genre_id_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genre"("id");