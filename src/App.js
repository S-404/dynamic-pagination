import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [comments, setComments] = useState([])
    const [fetching, setFetching] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    //вешаем слушатель скролл
    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)
        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    //получаем данные при условии если fetching = true
    useEffect(() => {
        if (fetching) {
            axios.get(`https://jsonplaceholder.typicode.com/comments?_limit=30&_page=${currentPage}`)
                .then(response => {
                    //добавляем данные в общий массив
                    setComments([...comments,...response.data])
                    //инкремент. номер актуальной страницы
                    setCurrentPage((prevState) => prevState + 1)

                })
                .finally(() => setFetching(false))
        }
    }, [fetching])

    //при скролле до конца страницы подгружаем еще данные
    const scrollHandler = (e) => {
        let scrollHeight = e.target.documentElement.scrollHeight
        let scrollTop = e.target.documentElement.scrollTop
        let innerHeight = window.innerHeight
        //определяем находимся ли мы внизу страницы
        const paginationCondition = (scrollHeight - (scrollTop + innerHeight) < 100)
        if (paginationCondition) {
            //при прохождении условия триггерим загрузку данных
            setFetching(true)
        }
    }
    return (
        <div className="App">
            {comments.map(comment => (
                <div className='comment' key={comment.id}>
                    <h4 className='comment__header'>{comment.name}</h4>
                    <span className='comment__body'>{comment.body}</span>
                </div>
            ))}
        </div>
    );
}

export default App;
