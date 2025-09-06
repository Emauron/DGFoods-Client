import { useParams } from 'react-router-dom'
import Header from '../components/store/header/header'

export default function Store() {
    const { id } = useParams()
    return (
        <div>
            <Header />
        </div>
    )
}