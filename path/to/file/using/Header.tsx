import dynamic from 'next/dynamic'

const Header = dynamic(() => import('components/Header'), {
  loading: () => <p>Loading...</p>
})
