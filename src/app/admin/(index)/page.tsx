
export async function adminSignIn(formData: FormData) {
  'use server'

  // const name = formData.get('name');
 
  console.log('Admin sign in submitted!');

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export default async function AdminIndexPage() {

  return (
    <form action={adminSignIn} className="my-20 px-2 py-8 border border-black md:w-96 md:mx-auto">
      <fieldset>

        <div className="mb-4">
          <label htmlFor="identifier-input" className="block text-sm">Email address or Phone number</label>
          <input type="text" id="identifier-input" name="identifier" className="block w-full p-2 border border-green-800 outline-0 disabled:bg-gray-300" />
          <span className="block text-sm text-red-600">Input error</span>
        </div>

        <div className="mb-4">
          <label htmlFor="password-input" className="block text-sm">Password</label>
          <input type="password" id="password-input" name="password" className="block w-full p-2 border border-green-800 outline-0 disabled:bg-gray-300" />
          <span className="block text-sm text-red-600">Input error</span>
        </div>

        <button className="block w-full p-2 text-white bg-green-800 border border-green-800 hover:bg-green-600 disabled:bg-gray-400">
          Admin sign in
        </button>

      </fieldset>
    </form>
  );
}
