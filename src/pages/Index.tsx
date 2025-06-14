
import { AmazonStyleHeader } from '../components/AmazonStyleHeader';
import { AmazonStyleHomepage } from '../components/AmazonStyleHomepage';

const Index = () => {
  return (
    <div className="min-h-screen">
      <AmazonStyleHeader />
      <main>
        <AmazonStyleHomepage />
      </main>
    </div>
  );
};

export default Index;
