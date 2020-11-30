# Построение графиков.

### Описание:
Библиотека позволяет строить графики с различной кастомизацией и анимацией.

#### Демо:
Демонстрацию графиков можно посмотреть по ссылке
[Deploy](https://shishovka.github.io/dp_chart/)

#### Установка:
`npm run install`

#### Запуск:
`npm run srart` (for server running at http://localhost:1234)

#### Инструкция по сборке:
Для сборки проекта можно воспользоваться командой:
`browserify ./src/index.ts -p [ tsify --noImplicitAny ] > chart-bundle.js`
Команда создаст в корневой папке проекта файл `chart-bundle.js` с кодом проекта.
Теперь этот файл можно подключить в `index.html` следующим образом:
`<script src="./chart-bundle.js"></script>`
**Важно:** проект не соберется, если в коде будут ошибки TypeScripta. Для быстрого решения данной проблемы я использую `// @ts-ignore`

#### Конфигурация графиков
В папке `./src/configs` находятся файлы-кофиги, для настройки графиков с демо-страницы.
* `.src/configs/indices-chart-black.ts` черно белый график с одним рядом данных и текстовысм выносками
* `.src/configs/indices-chart-colored.ts` красная и синяя серии с тултипами
Функция `createChart()` в конфиге отвечает за создание объекта `Chart`, настройку его внешнего вида и размещение на странице. 
Остальные функции в этих файлах: _кастомные функции по обработке данных для графиков и настройки взаимодействия с элементами управления на странице._

#### Размещение графиков на странице
В файле `./src/index.ts` содержится код, который вызывает создание графиков. 

Метод `load` объекта `WebFont` позволяет нам дождаться загрузки шрифтов (в демо примере шрифт `'Transcript Pro'`), после чего выполнить код в теле функции `active`:

    WebFont.load({
    custom: {
        families: ['Transcript Pro']
    },

    active: function () {

        // код для загрузки данных из CSV и создания графиков

    },
    });

Для рамещения графика на странице используется метод `customLoadDataFromCsv()` который на вход получает строку-URL CSV-файла с данными для построения графика.

    // цветной график CBH-indices-colored
    customLoadDataFromCsv(startCSVurl).then((data) => {
      // место размещения графика на странице
      const chartContainer = document.getElementById('indexChart_1');
      
      // разбираем данные из csv файла по массивам
      let chartData = csvToCols(data);
      let cbh1 = chartData[2].slice(1).map((el) => { return +el });
      let cbh5 = chartData[1].slice(1).map((el) => { return +el });
      let xLabels = chartData[0].slice(1).map((el) => { return new Date(el) });
      let zeroSeries = cbh1.map(() => 0);

      // вызов функции создания графика из конфига .src/configs/indices-chart-colored.ts
      createChart_ind_colored(chartContainer, [xLabels, cbh5, cbh1, zeroSeries]);

    })
      .catch((err) => {
        console.log(err);
      })

#### Контакты
По вопросам работы с библиотекой можно обратиться: 
[Telegram](https://t.me/const_tt)
