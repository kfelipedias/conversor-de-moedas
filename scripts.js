const convertButton = document.querySelector(".convert-button")
const fromSelect = document.querySelector(".currency-select-from")
const toSelect = document.querySelector(".currency-select")
const lastUpdate = document.querySelector(".last-update")

// Para adicionar outra moeda, é só incluir uma linha aqui
const currencies = {
    BRL: { name: "Real Brasileiro", locale: "pt-BR", flag: "br" },
    USD: { name: "Dólar americano", locale: "en-US", flag: "us" },
    EUR: { name: "Euro", locale: "de-DE", flag: "eu" },
    GBP: { name: "Libra esterlina", locale: "en-GB", flag: "gb" },
    JPY: { name: "Iene japonês", locale: "ja-JP", flag: "jp" },
    ARS: { name: "Peso argentino", locale: "es-AR", flag: "ar" },
    CAD: { name: "Dólar canadense", locale: "en-CA", flag: "ca" },
    AUD: { name: "Dólar australiano", locale: "en-AU", flag: "au" },
    CHF: { name: "Franco suíço", locale: "de-CH", flag: "ch" },
    CNY: { name: "Yuan chinês", locale: "zh-CN", flag: "cn" },
}

let rates = {} // taxas com base em 1 BRL

// Preenche um select com as moedas e define a moeda padrão
function fillSelect(select, defaultCode) {
    for (const code in currencies) {
        const option = document.createElement("option")
        option.value = code
        option.textContent = `${code} ${currencies[code].name}`
        select.appendChild(option)
    }
    select.value = defaultCode
}

function formatCurrency(code, value) {
    return new Intl.NumberFormat(currencies[code].locale, {
        style: "currency", currency: code
    }).format(value)
}

// Busca as cotações na API
async function fetchRates() {
    try {
        const response = await fetch("https://open.er-api.com/v6/latest/BRL")
        const data = await response.json()

        if (data.result === "success") {
            rates = data.rates
            lastUpdate.textContent = "Cotação de " +
                new Date(data.time_last_update_utc).toLocaleDateString("pt-BR")
            convertValues()
        }
    } catch (error) {
        console.error("Erro ao buscar cotações:", error)
        lastUpdate.textContent = "Não foi possível atualizar as cotações"
    }
}

function convertValues() {
    const inputValue = parseFloat(
        document.querySelector(".input-currecy").value.replace(",", ".")
    ) || 0
    const currencyValueToConvert = document.querySelector(".currency-value-to-convert")
    const currencyValueConverted = document.querySelector(".currency-value")

    const from = fromSelect.value
    const to = toSelect.value

    currencyValueToConvert.innerHTML = formatCurrency(from, inputValue)

    if (rates[from] && rates[to]) {
        // converte para BRL (dividindo) e depois para a moeda de destino (multiplicando)
        const result = inputValue / rates[from] * rates[to]
        currencyValueConverted.innerHTML = formatCurrency(to, result)
    }
}

function changeCurrency() {
    const from = fromSelect.value
    const to = toSelect.value

    document.getElementById("currency-name-from").innerHTML = currencies[from].name
    document.querySelector(".currency-img-from").src =
        `https://flagcdn.com/w80/${currencies[from].flag}.png`

    document.getElementById("currency-name").innerHTML = currencies[to].name
    document.querySelector(".currency-img").src =
        `https://flagcdn.com/w80/${currencies[to].flag}.png`

    convertValues()
}

fillSelect(fromSelect, "BRL") // padrão: Real
fillSelect(toSelect, "USD")   // padrão: Dólar
changeCurrency()
fetchRates()
setInterval(fetchRates, 60 * 60 * 1000) // atualiza a cada 1 hora

fromSelect.addEventListener("change", changeCurrency)
toSelect.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertValues)