import { Html, Tailwind, Button, Text, Head, Preview, Container, Body, Img, Section  } from '@react-email/components';

type PropsEmailData = {
  recoveryLink: string;
  politcsLink?: string;
}

const EmailRecovery = (emailData: PropsEmailData) => {
  
  const baseUrl = process.env.DOMAIN_URL ? `https://${process.env.DOMAIN_URL}/` : '';
  
  return (<>
<Tailwind>
    <Head>
      
    </Head>
    <Html>
      
        <Preview>Recupere seu acesso na PlanMilhas</Preview>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="mx-auto border border-solid border-[#eaeaea] rounded my-[40px] p-[20px] w-[560px] ">
            <Section className="mt-[32px] mb-[32px]">
              <Img 
                src={`${baseUrl}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_plamilhas.555669ca.png&w=256&q=75`}
                width="180"
                height="35"
                alt='PlanMilhas'
                className="my-0 mx-auto"
              />
            </Section>
            <div className="border-solid border-b border-t-0 border-[#eaeaea]"></div>
            
            <Text className="text-center text-lg font-semibold mt-5 text-gray-800">Recupere sua senha</Text>
            <Text className="text-center text-gray-700 text-base mx-5 mt-8 mb-8">Você solicitou recentemente a redefinição de senha em nosso site. Recupere sua senha agora clicando no botão.*</Text>
            
            <Section className="text-center w-[280px] mt-[60px]">
              <Button href={emailData.recoveryLink} className="bg-[#26408c] text-white font-semibold px-8 py-4 rounded cursor-pointer text-center">
                Clique e altere sua senha
              </Button>
            </Section>

            <Section className="text-center">
              <Text className="mt-5">Ou <a href={emailData.recoveryLink}><span className="text-[#26408c]"><u><b>clique aqui</b></u></span></a> para alterar</Text>
            </Section>
            
            <Section>
              <Text className="text-center text-xs text-gray-600 mt-8"><i>*O link gerado expira em <b>1 hora</b>, por isso não deixe de usá-lo o quanto antes.<br></br>** Se você não solicitou a redefinição, acesse sua conta e altere sua senha para sua segurança.</i></Text>
            </Section>

            <div className="border-solid border-b border-t-0 border-[#eaeaea]"></div>

            <Section className="text-center">
              <Text className="text-center text-gray-400 text-xs mt-5">
              Copyright © 2023 PlanMilhas. All rights reserved.<br></br>
              Você está recebendo este e-mail porque se cadastrou na PlanMilhas.<br></br>
              PlanMilhas LTDA | CNPJ xx.xxx.xxx/0001-00<br></br>
              Confira nossa <a href={emailData.politcsLink}><span className="text-[#26408c]"><u>Política de privacidade.</u></span></a> 
              </Text>
            </Section>
         
            
          </Container>
        </Body>
        
        </Html>
      </Tailwind>
    
  </>);
};

export default EmailRecovery;