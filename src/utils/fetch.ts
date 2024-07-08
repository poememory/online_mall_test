const Prurl = "http://localhost:5000/api";
const fetchApi = async <T>(options): Promise<T> => {
  const token = localStorage.getItem('token');
  const headers = token
    ? {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      }
    : {
        'Content-Type': 'application/json',
      };

  try {
    let response
    if(options.content){
        response = await fetch(Prurl + options.url, {
        method: options.method,
        headers: headers,
        body: JSON.stringify(options.content),
      });
    }
    else{
      response = await fetch(Prurl + options.url, {
        method: options.method,
        headers: headers
      });
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
export default fetchApi