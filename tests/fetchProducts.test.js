require('../mocks/fetchSimulator');
const { fetchProducts } = require('../helpers/fetchProducts');
const computadorSearch = require('../mocks/search');

describe('1 - Teste a função fetchProducts', () => {
  test('Se "fetchProducts" é uma função', () => {
    expect(typeof fetchProducts).toEqual('function');
  });

  test('Se ao executar a função "fetchProducts" com o argumento "computador" se "fetch" foi chamada;', () => {
    fetchProducts('computador')
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('Se ao chamar a função "fetchProducts" com o argumento "computador", a função "fetch" utiliza o endpoint "https://api.mercadolibre.com/sites/MLB/search?q=computador"', () => {
    fetchProducts('computador');
    expect(fetch).toHaveBeenCalledWith('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  });

  test('Se o retorno da função "fetchProducts" com o argumento "computador" é uma estrutura de dados igual ao objeto "computadorSearch"', async () => {
    expect.assertions(1);
    const expected = await fetchProducts('computador');
    expect(expected).toBe(computadorSearch);
  });

  test('Se, ao chamar a função "fetchProducts" sem argumento, retorna um erro com a mensagem: "You must provide an url"', async () => {
    expect.assertions(1);
    const expected = fetchProducts();
    await expect(expected).rejects.toThrow('You must provide an url');
  });
});
