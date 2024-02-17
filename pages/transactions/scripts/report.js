document.getElementById('btn-relatorio').addEventListener('click', async function() {
    try {

        const token = sessionStorage.getItem('token')

        let response = await fetch(`https://finance-wise.up.railway.app/balanco`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });

        const data = await response.json()

        
        const balance = document.getElementById('valor-balanco')
        balance.innerHTML = `R$${data.balancoMensal.balanco}`

        if (data.balancoMensal.balanco < 0) {
            balance.style.color = 'red';
        } else {
            balance.style.color = 'green';
        }

        const receita = document.getElementById('valor-receita-balanco')
        receita.innerHTML = `R$${data.balancoMensal.totalReceitas}`
        receita.style.color = 'green'

        const despesa = document.getElementById('valor-despesa-balanco')
        despesa.innerHTML = `R$${data.balancoMensal.totalDespesas}`
        despesa.style.color = 'red'

        const containerDespesa = document.querySelector('.despesas')
        containerDespesa.innerHTML = '<h3>Despesas</h3>'     
        
        const containerReceita = document.querySelector('.receitas')
        containerReceita.innerHTML = '<h3>Receitas</h3>'     
        
        // despesas
        Object.entries(data.transacoesPorCategoria.despesas).forEach(([chave, valor]) => {
            const container = document.querySelector('.despesas')

            const despesa = document.createElement('div')
            despesa.className = 'despesa'

            const nomeDespesa = document.createElement('p')
            nomeDespesa.innerHTML = chave

            const valorDespesa = document.createElement('p')
            valorDespesa.id = 'valor-despesa'
            valorDespesa.innerHTML = `R$${valor}`

            despesa.appendChild(nomeDespesa)
            despesa.appendChild(valorDespesa)
            container.appendChild(despesa)
        });

        // receitas
        Object.entries(data.transacoesPorCategoria.receitas).forEach(([chave, valor]) => {
            const container = document.querySelector('.receitas')

            const receita = document.createElement('div')
            receita.className = 'receita'

            const nomeReceita = document.createElement('p')
            nomeReceita.innerHTML = chave

            const valorReceita = document.createElement('p')
            valorReceita.id = 'valor-receita'
            valorReceita.innerHTML = `R$${valor}`

            receita.appendChild(nomeReceita)
            receita.appendChild(valorReceita)
            container.appendChild(receita)
        });    

      const labels = data.variacoesDiarias.map(item => moment(item.data).format('DD/MM/YYYY'));
      const dadosReceitas = data.variacoesDiarias.map(item => item.receitas);
      const dadosDespesas = data.variacoesDiarias.map(item => Math.abs(item.despesas));

      const maiorDespesa = Math.max(...dadosDespesas);
      const maiorReceita = Math.max(...dadosReceitas);

      const maior = maiorDespesa > maiorReceita ? maiorDespesa : maiorReceita;

      const ctx = document.getElementById('grafico').getContext('2d');

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Receitas',
              borderColor: 'green',
              backgroundColor: 'rgba(0, 128, 0, 0.1)',
              data: dadosReceitas,
            },
            {
              label: 'Despesas',
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              data: dadosDespesas,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: 'category',
            },
            y: {
              beginAtZero: true,
              max: maior + 100,
            },
          },
        },
      });


    } catch (error) {
        
    }
})