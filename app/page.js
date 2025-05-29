
import styles from "./page.module.css";
import MainNav from '@/components/MainNav';
import MainFooter from '@/components/MainFooter';
import ContentSection from "@/components/ContentSection";
import SearchBar  from "@/components/SearchBar";

export default function Home() {
  return (
    <div>
        <MainNav />
        <ContentSection />
        <SearchBar />
        <ContentSection />
        <MainFooter />
    </div>
  );
}
