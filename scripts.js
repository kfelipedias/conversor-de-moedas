const convertButton = document.querySelector(".convert-button")
const currencySelect = document.querySelector(".currency-select")
const lastUpdate = document.querySelector(".last-update")

// Para adicionar outra moeda, é só incluir uma linha aqui
const currencies = {
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

// Preenche o select com as moedas
function fillSelect() {
    for (const code in currencies) {
        const option = document.createElement("option")
        option.value = code
        option.textContent = `${code} ${currencies[code].name}`
        currencySelect.appendChild(option)
    }
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

    const code = currencySelect.value
    const rate = rates[code] // quanto vale 1 BRL na moeda escolhida

    if (rate) {
        currencyValueConverted.innerHTML = new Intl.NumberFormat(currencies[code].locale, {
            style: "currency", currency: code
        }).format(inputValue * rate)
    }

    currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
        style: "currency", currency: "BRL"
    }).format(inputValue)
}

function changeCurrency() {
    const code = currencySelect.value
    document.getElementById("currency-name").innerHTML = currencies[code].name
    document.querySelector(".currency-img").src =
        `https://flagcdn.com/w80/${currencies[code].flag}.png`
    convertValues()
}

fillSelect()
changeCurrency()
fetchRates()
setInterval(fetchRates, 60 * 60 * 1000) // atualiza a cada 1 hora

currencySelect.addEventListener("change", changeCurrency)
convertButton.addEventListener("click", convertValues)