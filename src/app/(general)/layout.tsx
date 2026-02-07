import { Facebook, Mail, MapPin, Youtube } from 'lucide-react';
import { getSession } from '@/utils/session';
import { findUserById } from '@/services/user-service';
import GeneralLayoutHeader from './header';
import Breadcrumbs from '@/components/breadcrumbs';

export default async function GeneralLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession();
  
  const user = await (session === null || session.userId === undefined ? null : findUserById(session.userId));

  return (
    <div className="min-h-full relative">

      <GeneralLayoutHeader user={user} />
      
      <main className="mt-32 lg:mt-[10.5rem] pb-[28rem] lg:pb-72">
        
        <div className="container mx-auto p-2">

          <Breadcrumbs />
          
          { children }

        </div>

      </main>

      <footer className="w-full bg-primary text-on-primary absolute bottom-0">
        <div className="container mx-auto p-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:flex-row-reverse">
          <ul className="mb-8 lg:mb-0">
            <li className="mb-4">
              <div className="flex gap-2 items-start">
                <Facebook />
                <a href="https://www.facebook.com/smacnkpogwuph" target="_blank">Facebook</a>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex gap-2 items-start">
                <Youtube />
                <a href="https://www.youtube.com/@Smacnkpogwudndn" target="_blank">YouTube</a>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex gap-2 items-start">
                <Mail />
                <a href="mailto:smacnkpogwudeanery@gmail.com" target="_blank">smacnkpogwudeanery@gmail.com</a>
              </div>
            </li>

            <li className="mb-4">
              <div className="flex gap-2 items-start">
                <MapPin />
                <div>
                  <div>51, Trans-Amadi Road</div>
                  <div>P.M.B 058, Nkpogwu</div>
                  <div>Trans-Amadi, Port Harcourt, Rivers State, Nigeria</div>
                </div>
              </div>
            </li>
          </ul>

          <div>
            <div className="font-bold text-xl">Diocese of Niger Delta North</div> 
            <div className="text-sm">Anglican Communion</div> 
            <div className="font-bold text-xl">ST Matthew's Anglican Church</div> 
            <div className="text-sm">Nkpogwu Deanery</div> 
            <div className="italic">The Flame of Anglican Revival</div> 
          </div>
        </div>
      </footer>

    </div>
  );
}
