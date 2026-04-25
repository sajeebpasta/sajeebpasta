import penneImg from "@/assets/penne.png";
import spaghettiImg from "@/assets/spaghetti.png";
import macaroniImg from "@/assets/macaroni.png";
import macaroniOysterBigImg from "@/assets/macaroni-oyster-big.png";
import macaroniOysterSmallImg from "@/assets/macaroni-shells.png";
import macaroniOysterMediumImg from "@/assets/macaroni-oyster-medium.png";
import macaroniBambooImg from "@/assets/macaroni-bamboo.png";
import fusilliImg from "@/assets/fusilli.png";
import cookNoodlesImg from "@/assets/cook-noodles-bulk.png";
import cookNoodles3049Img from "@/assets/cook-noodles-3049.png";
import cookNoodles894Img from "@/assets/cook-noodles-894.png";
import cookNoodles886Img from "@/assets/cook-noodles-886.png";
import farfalleImg from "@/assets/farfalle.png";
import shellImg from "@/assets/shell.png";
import macaroniScrewImg from "@/assets/macaroni-screw.png";
import macaroniAssortedImg from "@/assets/macaroni-assorted.png";
import { Product } from "../types";

export const allProducts: Product[] = [
  { id: 1, name: "ম্যাকারনী ওয়েস্টার বিগ", sku: "1301", size: "30kg", details: "আইডি নম্বর: ১৩০১\nব্যাগের ওজন: ৩০ কেজি\nবড় শেল আকৃতির ম্যাকারনি", image: macaroniOysterMediumImg, unit: "ব্যাগ" },
  { id: 2, name: "ম্যাকারনী ওয়েস্টার স্মল", sku: "1304", size: "30kg", details: "আইডি নম্বর: ১৩০৪\nব্যাগের ওজন: ৩০ কেজি\nছোট শেল আকৃতির ম্যাকারনি", image: macaroniOysterSmallImg, unit: "ব্যাগ" },
  { id: 5, name: "ম্যাকারনী ওয়েস্টার লার্জ", sku: "1305", size: "30kg", details: "আইডি নম্বর: ১৩০৫\nব্যাগের ওজন: ৩০ কেজি", image: macaroniOysterBigImg, unit: "ব্যাগ" },
  { id: 3, name: "ম্যাকারনী ব্যাম্বো", sku: "1303", size: "30kg", details: "আইডি নম্বর: ১৩০৩\nব্যাগের ওজন: ৩০ কেজি", image: macaroniBambooImg, unit: "ব্যাগ" },
  { id: 33, name: "কুক নুডলস বাল্ক (কার্টুন)", sku: "3049", size: "12kg", details: "আইডি নম্বর: ৩০৪৯\nবক্সের ওজন: ১২ কেজি", image: cookNoodles3049Img, unit: "বক্স" },
  { id: 34, name: "কুক নুডলস বাল্ক (ফয়েল প্যাক)", sku: "894", size: "15kg", details: "আইডি নম্বর: ৮৯৪\nব্যাগের ওজন: ১৫ কেজি", image: cookNoodles894Img, unit: "ব্যাগ" },
  { id: 35, name: "কুক নুডলস বাল্ক (কার্টুন)", sku: "886", size: "15kg", details: "আইডি নম্বর: ৮৮৬\nব্যাগের ওজন: ১৫ কেজি", image: cookNoodles886Img, unit: "ব্যাগ" },
  { id: 36, name: "ম্যাকারনি অ্যাসর্টেড", sku: "1306", size: "30kg", details: "আইডি নম্বর: ১৩০৬\nব্যাগের ওজন: ৩০ কেজি", image: macaroniAssortedImg, unit: "ব্যাগ" },
  { id: 37, name: "ম্যাকারনী স্ক্রু", sku: "1302", size: "15kg", details: "আইডি নম্বর: ১৩০২\nব্যাগের ওজন: ১৫ কেজি", image: macaroniScrewImg, unit: "ব্যাগ" },
];
