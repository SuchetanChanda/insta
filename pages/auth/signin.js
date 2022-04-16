import { getProviders, signIn as SignIntoProvider} from 'next-auth/react'
import Header from '../../Components/Header'
// Browser... 
function signIn({providers}) {
  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center min-h-screen py-2 px-14 text-center -mt-20'>
        <img className='w-80' src="https://links.papareact.com/ocw" alt="" />
      <p className='text-xs italic'>
        This is not a REAL app. It is built for educational purposes only.
      </p>
      <div>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button className='p-3 mt-10 bg-blue-500 rounded-lg text-white' onClick={() => SignIntoProvider(provider.id, { callbackUrl:'/'})}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
      </div>
      </div> 
    </>
  );
}

// Server side render
export async function getServerSideProps(){
    const providers = await getProviders();

    return{
        props: {
            providers,
        },
    };
}

export default signIn;